import stringify from "json-stringify-safe";
import { ConnectedUser } from "../../models/connected-user";
import { WebhookRequest } from "../../models/webhook-request";
import { capture } from "../../shared/notifications";
import { getSettingsOrFail } from "../settings/getSettings";
import { ApiTypes, reportUsage as reportUsageCmd } from "../usage/report-usage";
import { processRequest } from "./webhook";
import { createWebhookRequest } from "./webhook-request";

export const dapiWebhookType = [
  "devices.provider-connected",
  "devices.provider-disconnected",
  "devices.health-data",
] as const;
export type DAPIWebhookType = (typeof dapiWebhookType)[number];

export function isDAPIWebhookRequest(webhookRequest: WebhookRequest): boolean {
  return dapiWebhookType.map(String).includes(webhookRequest.type);
}

export const reportDevicesUsage = (cxId: string, cxUserIds: string[]): void => {
  const apiType = ApiTypes.devices;
  cxUserIds.forEach(cxUserId => reportUsageCmd({ cxId, entityId: cxUserId, apiType }));
};

/**
 * Sends an update to the CX about their user subscribing to a provider.
 *
 * Executed asynchronhously, so it should treat errors w/o expecting it to be done upstream.
 */
export const sendProviderConnected = async (
  connectedUser: ConnectedUser,
  provider: string
): Promise<void> => {
  let webhookRequest;
  try {
    const { id: userId, cxId } = connectedUser;
    const providers = connectedUser?.providerMap ? Object.keys(connectedUser.providerMap) : [];
    const payload = { users: [{ userId, provider, connectedProviders: providers }] };
    const settings = await getSettingsOrFail({ id: cxId });

    webhookRequest = await createWebhookRequest({
      cxId,
      type: "devices.provider-connected",
      payload,
    });
    await processRequest(webhookRequest, settings);
  } catch (error) {
    console.log(
      `Failed to send provider connected WH - provider: ${provider}, ` +
        `user: ${connectedUser.id}, webhookRequest: ${stringify(webhookRequest)}` +
        `error: ${error}`
    );
    capture.error(error, {
      extra: { connectedUser, provider, context: `webhook.sendProviderConnected`, error },
      level: "error",
    });
  }
};