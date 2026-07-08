/**
 * 对话 hook
 *
 * 管理公共对话和私聊线程。
 */
import { useState, useCallback, useEffect } from 'react';
import { messagesApi } from '../../api';

interface Thread {
  id: string;
  participants: string[];
  isPrivate: boolean;
  lastMessage?: string;
  updatedAt: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  threadId: string;
}

export function useConversation(sessionId: string | null) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    loadThreads();
    loadMessages();
  }, [sessionId]);

  const loadThreads = useCallback(async () => {
    if (!sessionId) return;
    try {
      const data = await messagesApi.getThreads(sessionId);
      setThreads(data.threads || []);
    } catch (e) {
      console.error('加载线程失败', e);
    }
  }, [sessionId]);

  const loadMessages = useCallback(async (threadId?: string) => {
    if (!sessionId) return;
    try {
      const data = await messagesApi.list(sessionId, threadId);
      setMessages(data.messages || []);
    } catch (e) {
      console.error('加载消息失败', e);
    }
  }, [sessionId]);

  /** 发送消息 */
  const sendMessage = useCallback(async (content: string, threadId?: string) => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      await messagesApi.send(sessionId, content, threadId || '', 'human', 'player', '玩家');
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'player',
        content,
        timestamp: new Date().toISOString(),
        threadId: threadId || 'public',
      };
      setMessages(prev => [...prev, newMessage]);
    } catch (e) {
      setError('发送失败');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  /** 创建私聊线程 */
  const createPrivateThread = useCallback(async (participantId: string) => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await messagesApi.createThread(sessionId, 'private', ['player', participantId]);
      const newThread: Thread = {
        id: data.thread_id || '',
        participants: ['player', participantId],
        isPrivate: true,
        updatedAt: new Date().toISOString(),
      };
      setThreads(prev => [...prev, newThread]);
    } catch (e) {
      setError('创建私聊失败');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  return {
    threads,
    messages,
    sendMessage,
    createPrivateThread,
    loadThreads,
    loadMessages,
    loading,
    error,
  };
}
