/**
 * 证物 API
 *
 * 证物的发现、出示、组合等操作。
 */
import { apiClient } from './client';

export const evidencesApi = {
  /** 获取证物列表 */
  list: (sessionId: string) =>
    apiClient.get(`/sessions/${sessionId}/evidences`),
  getAll: (sessionId: string) =>
    apiClient.get(`/sessions/${sessionId}/evidences`),

  /** 获取公开证物 */
  getPublic: (sessionId: string) =>
    apiClient.get(`/sessions/${sessionId}/evidences/public`),

  /** 发现证物 */
  discover: (sessionId: string, evidenceId: string) =>
    apiClient.post(`/sessions/${sessionId}/evidences/discover`, { evidence_id: evidenceId }),

  /** 出示证物 */
  present: (sessionId: string, evidenceId: string, presentedTo: string, isPublic: boolean = true) =>
    apiClient.post(`/sessions/${sessionId}/evidences/present`, {
      evidence_id: evidenceId,
      presented_to: presentedTo,
      is_public: isPublic,
    }),

  /** 组合证物 */
  combine: (sessionId: string, evidenceIds: string[]) =>
    apiClient.post(`/sessions/${sessionId}/evidences/combine`, { evidence_ids: evidenceIds }),
};
