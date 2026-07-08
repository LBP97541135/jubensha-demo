/**
 * AI 服务状态 API
 *
 * 获取 LLM 服务状态、fallback 模式等信息。
 */
import { apiClient } from './client';

export interface AIStatus {
  service: string;
  model: string;
  available: boolean;
  fallback_mode: 'LOCAL_ONLY' | 'NO_LLM' | 'OPENAI';
  api_key_configured: boolean;
}

export const aiApi = {
  /** 获取 AI 服务状态 */
  getStatus: () =>
    apiClient.get<AIStatus>('/ai/status'),
};
