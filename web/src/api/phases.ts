/**
 * 阶段 API
 *
 * 游戏阶段的获取、推进、强制跳转等操作。
 */
import { apiClient } from './client';

export const phasesApi = {
  /** 获取当前阶段 */
  getCurrent: (sessionId: string) =>
    apiClient.get(`/sessions/${sessionId}/phase`),

  /** 推进阶段 */
  advance: (sessionId: string) =>
    apiClient.post(`/sessions/${sessionId}/phase/advance`),

  /** 强制跳转阶段 */
  force: (sessionId: string, targetPhase: string) =>
    apiClient.post(`/sessions/${sessionId}/phase/force`, { target_phase: targetPhase }),

  /** 揭示真相 */
  reveal: (sessionId: string) =>
    apiClient.post(`/sessions/${sessionId}/reveal`),
};
