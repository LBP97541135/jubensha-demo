/**
 * 阶段推进 hook
 *
 * 管理游戏阶段的推进和状态查询。
 */
import { useState, useCallback, useEffect } from 'react';
import { phasesApi } from '../../api';

interface PhaseInfo {
  display_name: string;
  description: string;
  allowed_actions: string[];
}

export function usePhaseFlow(sessionId: string | null) {
  const [currentPhase, setCurrentPhase] = useState<string>('');
  const [phaseInfo, setPhaseInfo] = useState<PhaseInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    loadPhase();
  }, [sessionId]);

  const loadPhase = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await phasesApi.getCurrent(sessionId);
      setCurrentPhase(data.phase || '');
      setPhaseInfo(data.phase_info || null);
    } catch (e) {
      setError('加载阶段失败');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  /** 推进到下一阶段 */
  const advancePhase = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await phasesApi.advance(sessionId);
      setCurrentPhase(data.phase || '');
      setPhaseInfo(data.phase_info || null);
    } catch (e) {
      setError('阶段推进失败');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  /** 强制跳转到指定阶段 */
  const forcePhase = useCallback(async (phase: string) => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await phasesApi.force(sessionId, phase);
      setCurrentPhase(data.phase || '');
      setPhaseInfo(data.phase_info || null);
    } catch (e) {
      setError('阶段跳转失败');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  /** 揭示真相 */
  const revealTruth = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await phasesApi.reveal(sessionId);
      setCurrentPhase(data.phase || '');
    } catch (e) {
      setError('揭示真相失败');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  /** 是否可以推进阶段 */
  const canAdvance = phaseInfo?.allowed_actions?.includes('advance') ?? false;

  return {
    currentPhase,
    canAdvance,
    advancePhase,
    forcePhase,
    revealTruth,
    loadPhase,
    phaseInfo,
    loading,
    error,
  };
}
