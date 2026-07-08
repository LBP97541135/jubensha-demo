/**
 * 私聊 hook
 *
 * 管理私聊线程和消息。
 */
import { useState, useCallback, useEffect } from 'react';
import { messagesApi } from '../../api';

interface PrivateThread {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage?: string;
  updatedAt: string;
}

interface PrivateMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

export function usePrivateChat(sessionId: string | null) {
  const [privateThreads, setPrivateThreads] = useState<PrivateThread[]>([]);
  const [currentThread, setCurrentThread] = useState<PrivateThread | null>(null);
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    loadThreads();
  }, [sessionId]);

  const loadThreads = useCallback(async () => {
    if (!sessionId) return;
    try {
      const data = await messagesApi.getThreads(sessionId, 'private');
      setPrivateThreads(data.threads || []);
    } catch (e) {
      console.error('加载私聊线程失败', e);
    }
  }, [sessionId]);

  /** 选择私聊线程 */
  const selectThread = useCallback(async (threadId: string) => {
    const thread = privateThreads.find(t => t.id === threadId);
    setCurrentThread(thread || null);
    if (!sessionId || !thread) return;
    try {
      const data = await messagesApi.list(sessionId, threadId);
      setMessages(data.messages || []);
    } catch (e) {
      console.error('加载私聊消息失败', e);
      setMessages([]);
    }
  }, [privateThreads, sessionId]);

  /** 发送私聊消息 */
  const sendPrivateMessage = useCallback(async (content: string) => {
    if (!sessionId || !currentThread) return;
    setLoading(true);
    setError(null);
    try {
      await messagesApi.send(sessionId, content, currentThread.id, 'human', 'player', '玩家');
      const newMessage: PrivateMessage = {
        id: Date.now().toString(),
        sender: 'player',
        content,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, newMessage]);
    } catch (e) {
      setError('发送失败');
    } finally {
      setLoading(false);
    }
  }, [sessionId, currentThread]);

  return {
    privateThreads,
    currentThread,
    messages,
    selectThread,
    sendPrivateMessage,
    loadThreads,
    loading,
    error,
  };
}
