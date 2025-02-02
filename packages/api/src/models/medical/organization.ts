import {
  Organization,
  OrganizationData,
  OrganizationBizType,
} from "@metriport/core/domain/organization";
import { DataTypes, Sequelize } from "sequelize";
import { BaseModel, ModelSetup } from "../../models/_default";

export class OrganizationModel extends BaseModel<OrganizationModel> implements Organization {
  static NAME = "organization";
  declare cxId: string;
  declare oid: string;
  declare organizationNumber: number;
  declare type: OrganizationBizType;
  declare data: OrganizationData;

  static setup: ModelSetup = (sequelize: Sequelize) => {
    OrganizationModel.init(
      {
        ...BaseModel.attributes(),
        cxId: {
          type: DataTypes.UUID,
        },
        oid: {
          type: DataTypes.STRING,
        },
        organizationNumber: {
          type: DataTypes.INTEGER,
          unique: true,
        },
        type: {
          type: DataTypes.ENUM(...Object.values(OrganizationBizType)),
          defaultValue: OrganizationBizType.healthcareProvider,
        },
        data: {
          type: DataTypes.JSONB,
        },
      },
      {
        ...BaseModel.modelOptions(sequelize),
        tableName: OrganizationModel.NAME,
      }
    );
  };
}
