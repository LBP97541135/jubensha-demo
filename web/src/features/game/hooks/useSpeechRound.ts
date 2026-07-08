/**
 * 发言轮 hook
 *
 * 管理发言轮次和消息发送。
 */
import { useState, useCallback } from 'react';
import { messagesApi } from '../../api';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'speech' | 'action' | 'system';
}

export function useSpeechRound(sessionId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** 发送发言 */
  const sendMessage = useCallback(async (content: string) => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    setIsSpeaking(true);
    try {
      await messagesApi.send(sessionId, content, '', 'human', 'player', '玩家');
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'player',
        content,
        timestamp: new Date().toISOString(),
        type: 'speech',
      };
      setMessages(prev => [...prev, newMessage]);
    } catch (e) {
      setError('发送失败');
    } finally {
      setLoading(false);
      setIsSpeaking(false);
    }
  }, [sessionId]);

  return {
    messages,
    sendMessage,
    isSpeaking,
    loading,
    error,
  };
}
