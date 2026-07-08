/**
 * Script API.
 */
import { apiClient } from './client';
import type { BackendScript } from './legacy-types';

export const scriptsApi = {
  list: () =>
    apiClient.get<{ scripts: BackendScript[] }>('/scripts').then((result) => result.scripts || []),

  get: (scriptId: string) =>
    apiClient.get<BackendScript>(`/scripts/${scriptId}`),

  getEvidencePool: (scriptId: string) =>
    apiClient.get(`/scripts/${scriptId}/evidence-pool`),
};

export const getScript = (scriptId: string): Promise<BackendScript> =>
  scriptsApi.get(scriptId);

export const listScripts = (): Promise<BackendScript[]> =>
  scriptsApi.list();
