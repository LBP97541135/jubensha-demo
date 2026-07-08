/**
 * 选角 hook
 *
 * 管理角色分配和 Agent 绑定。
 */
import { useState, useCallback, useEffect } from 'react';
import { castingApi, type CastItem } from '../../api';

export function useCasting(sessionId: string | null) {
  const [casts, setCasts] = useState<CastItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    loadCasts();
  }, [sessionId]);

  const loadCasts = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await castingApi.get(sessionId);
      setCasts(data.casts || []);
    } catch (e) {
      setError('加载选角信息失败');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  /** 提交选角结果 */
  const submitCast = useCallback(async (castList: CastItem[]) => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      await castingApi.set(sessionId, castList);
      setCasts(castList);
    } catch (e) {
      setError('选角失败');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  /** 重置选角 */
  const resetCast = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      await castingApi.reset(sessionId);
      setCasts([]);
    } catch (e) {
      setError('重置选角失败');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  return {
    casts,
    loading,
    error,
    submitCast,
    resetCast,
    loadCasts,
  };
}
