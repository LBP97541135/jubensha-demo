/**
 * 选角 API
 *
 * 游戏选角的设置、获取、重置等操作。
 */
import { apiClient } from './client';

export interface CastItem {
  type: string;
  role: string;
  agent_key?: string;
}

export const castingApi = {
  /** 设置选角 */
  set: (sessionId: string, casts: CastItem[]) =>
    apiClient.post(`/sessions/${sessionId}/cast`, casts),

  /** 获取选角信息 */
  get: (sessionId: string) =>
    apiClient.get(`/sessions/${sessionId}/cast`),

  /** 重置选角 */
  reset: (sessionId: string) =>
    apiClient.delete(`/sessions/${sessionId}/cast`),
};
