import { DocumentReference } from "@medplum/fhirtypes";
import { Config } from "../config";

export const bucket = Config.getSandboxBucketName() ?? "missing-value";

export type DataEntry = {
  s3Info: { bucket: string; key: string };
  docRef: DocumentReference;
};