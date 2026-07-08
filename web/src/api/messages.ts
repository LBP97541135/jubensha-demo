/**
 * 消息 API
 *
 * 对话消息的发送、查询、线程管理等操作。
 */
import { apiClient } from './client';

export const messagesApi = {
  /** 获取消息列表 */
  list: (sessionId: string, threadId?: string, limit: number = 50) => {
    const params = new URLSearchParams();
    if (threadId) params.set('thread_id', threadId);
    params.set('limit', limit.toString());
    return apiClient.get(`/sessions/${sessionId}/messages?${params}`);
  },
  get: (sessionId: string) =>
    apiClient.get(`/sessions/${sessionId}/messages`),

  /** 发送消息 */
  send: (sessionId: string, content: string, threadId: string = '', senderType: string = 'human', senderId: string = 'player', senderName: string = '玩家') =>
    apiClient.post(`/sessions/${sessionId}/messages`, {
      content,
      thread_id: threadId,
      sender_type: senderType,
      sender_id: senderId,
      sender_name: senderName,
    }),

  /** 获取线程列表 */
  getThreads: (sessionId: string, threadType?: string) => {
    const params = new URLSearchParams();
    if (threadType) params.set('thread_type', threadType);
    return apiClient.get(`/sessions/${sessionId}/messages/threads?${params}`);
  },

  /** 创建线程 */
  createThread: (sessionId: string, threadType: string = 'private', participantIds: string[]) =>
    apiClient.post(`/sessions/${sessionId}/messages/threads`, {
      thread_type: threadType,
      participant_ids: participantIds,
    }),
};
