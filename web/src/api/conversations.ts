/**
 * 对话记录 API
 *
 * 保存和查询游戏中的对话记录。
 */
import { apiClient } from './client';

export interface ConversationSaveData {
  sessionId: string;
  actorName: string;
  chatMessages?: Array<{ role: string; content: string }>;
  originalResponse?: string;
  critiqueResponse?: string;
  refinedResponse?: string;
  finalResponse?: string;
}

export const conversationsApi = {
  /** 保存对话记录 */
  save: (data: ConversationSaveData) =>
    apiClient.post('/conversations/save', {
      session_id: data.sessionId,
      actor_name: data.actorName,
      chat_messages: data.chatMessages || [],
      original_response: data.originalResponse || '',
      critique_response: data.critiqueResponse || '',
      refined_response: data.refinedResponse || '',
      final_response: data.finalResponse || '',
    }),

  /** 获取会话对话记录 */
  getBySession: (sessionId: string, actorName?: string, limit?: number) =>
    apiClient.get(`/conversations/session/${sessionId}`, {
      actor_name: actorName,
      limit,
    }),

  /** 清空会话对话记录 */
  clear: (sessionId: string) =>
    apiClient.delete(`/conversations/session/${sessionId}`),
};
