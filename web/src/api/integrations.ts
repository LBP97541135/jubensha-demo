import { apiClient } from "./client";

export interface IntegrationStatus {
  integration_mode: string;
  external_integrations_allowed: boolean;
}

export const integrationsApi = {
  getStatus: () => apiClient.get<IntegrationStatus>("/integrations/status"),
};
