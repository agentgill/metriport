import * as uuid from "uuid";
import dayjs from "dayjs";
import { XMLBuilder } from "fast-xml-parser";
import { createSecurityHeader } from "../security/security-header";
import { signFullSaml } from "../security/sign";
import { namespaces } from "../namespaces";
import {
  ORGANIZATION_NAME_DEFAULT as metriportOrganization,
  replyTo,
} from "../../carequality/shared";
import { wrapIdInUrnUuid } from "../utils";

const action = "urn:ihe:iti:2007:CrossGatewayQuery";
const findDocumentId = "14d4debf-8f97-4251-9a74-a90016b0af0d";

type DQBodyData = {
  id: string;
  gateway: {
    homeCommunityId: string;
    url: string;
  };
  externalGatewayPatient: {
    id: string;
    system: string;
  };
  classCode: Array<{
    code: string;
    system: string;
  }>;
  practiceSettingCode: Array<{
    code: string;
    system: string;
  }>;
  facilityTypeCode: Array<{
    code: string;
    system: string;
  }>;
  serviceDate: {
    dateFrom: string;
    dateTo: string;
  };
  documentCreationDate: {
    dateFrom: string;
    dateTo: string;
  };
  samlAttributes: {
    subjectRole: {
      display: string;
    };
    organization: string;
    organizationId: string;
    homeCommunityId: string;
    purposeOfUse: string;
  };
};

function createSoapBody(bodyData: DQBodyData): object {
  const messageId = wrapIdInUrnUuid(bodyData.id);
  const classCode = bodyData.classCode?.[0];
  const practiceSettingCode = bodyData.practiceSettingCode?.[0];
  const facilityTypeCode = bodyData.facilityTypeCode?.[0];
  const serviceDateFrom = dayjs(bodyData.serviceDate.dateFrom).format("YYYYMMDDHHmmss");
  const serviceDateTo = dayjs(bodyData.serviceDate.dateTo).format("YYYYMMDDHHmmss");
  const documentCreationDateFrom = dayjs(bodyData.documentCreationDate.dateFrom).format(
    "YYYYMMDDHHmmss"
  );
  const documentCreationDateTo = dayjs(bodyData.documentCreationDate.dateTo).format(
    "YYYYMMDDHHmmss"
  );
  const gatewayHomeCommunityId = bodyData.gateway.homeCommunityId;
  const externalGatewayPatientId = bodyData.externalGatewayPatient.id;
  const externalGatewayPatientSystem = bodyData.externalGatewayPatient.system;

  const soapBody = {
    "soap:Body": {
      "urn:AdhocQueryRequest": {
        "@_federated": "false",
        "@_id": messageId,
        "@_maxResults": "-1",
        "@_startIndex": "0",
        "urn:ResponseOption": {
          "@_returnType": "LeafClass",
        },
        "urn2:AdhocQuery": {
          "@_home": gatewayHomeCommunityId,
          "@_id": wrapIdInUrnUuid(findDocumentId),
          "@_lid": "urn:oasis:names:tc:ebxml-regrep:query:AdhocQueryRequest",
          "@_objectType": namespaces.urn2,
          "@_status": namespaces.urn2,
          "urn2:Slot": [
            {
              "@_name": "$XDSDocumentEntryPatientId",
              "@_slotType": "rim:StringValueType",
              "urn2:ValueList": {
                "urn2:Value": `'${externalGatewayPatientId}^^^&${externalGatewayPatientSystem}&ISO'`,
              },
            },
            {
              "@_name": "$XDSDocumentEntryStatus",
              "urn2:ValueList": {
                "urn2:Value": "('urn:oasis:names:tc:ebxml-regrep:StatusType:Approved')",
              },
            },
            {
              "@_name": "$XDSDocumentEntryClassCode",
              "urn2:ValueList": {
                "urn2:Value": `('${classCode?.code}^^${classCode?.system}')`,
              },
            },
            {
              "@_name": "$XDSDocumentEntryPracticeSettingCode",
              "urn2:ValueList": {
                "urn2:Value": `('${practiceSettingCode?.code}^^${practiceSettingCode?.system}')`,
              },
            },
            {
              "@_name": "$XDSDocumentEntryHealthcareFacilityTypeCode",
              "urn2:ValueList": {
                "urn2:Value": `('${facilityTypeCode?.code}^^${facilityTypeCode?.system}')`,
              },
            },
            {
              "@_name": "$XDSDocumentEntryServiceStartTimeFrom",
              "urn2:ValueList": {
                "urn2:Value": serviceDateFrom,
              },
            },
            {
              "@_name": "$XDSDocumentEntryServiceStartTimeTo",
              "urn2:ValueList": {
                "urn2:Value": serviceDateTo,
              },
            },
            {
              "@_name": "$XDSDocumentEntryCreationTimeFrom",
              "urn2:ValueList": {
                "urn2:Value": documentCreationDateFrom,
              },
            },
            {
              "@_name": "$XDSDocumentEntryCreationTimeTo",
              "urn2:ValueList": {
                "urn2:Value": documentCreationDateTo,
              },
            },
            {
              "@_name": "$XDSDocumentEntryType",
              "urn2:ValueList": {
                "urn2:Value": [`(${wrapIdInUrnUuid(uuid.v4())},${wrapIdInUrnUuid(uuid.v4())})`],
              },
            },
          ],
        },
      },
    },
  };
  return soapBody;
}

export function createITI38SoapEnvelope({
  bodyData,
  publicCert,
}: {
  bodyData: DQBodyData;
  publicCert: string;
}): string {
  const messageId = wrapIdInUrnUuid(bodyData.id);
  const toUrl = bodyData.gateway.url;

  const subjectRole = bodyData.samlAttributes.subjectRole.display;
  const homeCommunityId = bodyData.samlAttributes.homeCommunityId;
  const purposeOfUse = bodyData.samlAttributes.purposeOfUse;

  const createdTimestamp = dayjs().toISOString();
  const expiresTimestamp = dayjs(createdTimestamp).add(1, "hour").toISOString();

  const securityHeader = createSecurityHeader({
    publicCert,
    createdTimestamp,
    expiresTimestamp,
    toUrl,
    subjectRole,
    metriportOrganization,
    homeCommunityId,
    purposeOfUse,
  });

  const soapBody = createSoapBody(bodyData);

  const soapEnvelope = {
    "soap:Envelope": {
      "@_xmlns:soap": namespaces.soap,
      "@_xmlns:wsa": namespaces.wsa,
      "@_xmlns:urn": namespaces.urn,
      "@_xmlns:urn2": namespaces.urn2,
      "soap:Header": {
        "wsa:To": {
          "#text": toUrl,
          "@_mustUnderstand": "1",
        },
        "wsa:Action": {
          "#text": action,
          "@_mustUnderstand": "1",
        },
        "wsa:MessageID": messageId,
        "wsa:ReplyTo": {
          "wsa:Address": replyTo,
        },
        ...securityHeader,
      },
      ...soapBody,
    },
  };

  const options = {
    format: false,
    ignoreAttributes: false,
    suppressEmptyNode: true,
    declaration: {
      include: true,
      encoding: "UTF-8",
      version: "1.0",
    },
  };

  const builder = new XMLBuilder(options);
  const xmlContent = builder.build(soapEnvelope);
  return xmlContent;
}

export function createAndSignDQRequest(
  bodyData: DQBodyData,
  publicCert: string,
  privateKey: string
): string {
  const xmlString = createITI38SoapEnvelope({ bodyData, publicCert });
  const fullySignedSaml = signFullSaml({ xmlString, publicCert, privateKey });
  return fullySignedSaml;
}