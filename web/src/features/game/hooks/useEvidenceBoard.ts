/**
 * 证物 hook
 *
 * 管理证物的发现、出示和查询。
 */
import { useState, useCallback, useEffect } from 'react';
import { evidencesApi } from '../../api';

interface Evidence {
  id: string;
  name: string;
  description: string;
  category: string;
  discoveryState: string;
  isPublic: boolean;
}

export function useEvidenceBoard(sessionId: string | null) {
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [publicEvidences, setPublicEvidences] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    loadEvidences();
  }, [sessionId]);

  const loadEvidences = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await evidencesApi.list(sessionId);
      setEvidences(data.evidences || []);
    } catch (e) {
      setError('加载证物失败');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  /** 发现证物 */
  const discoverEvidence = useCallback(async (evidenceId: string) => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await evidencesApi.discover(sessionId, evidenceId);
      setEvidences(prev => [...prev, data]);
    } catch (e) {
      setError('发现证物失败');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  /** 出示证物 */
  const presentEvidence = useCallback(async (evidenceId: string, target: string) => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await evidencesApi.present(sessionId, evidenceId, target, true);
      const evidence = evidences.find(e => e.id === evidenceId);
      if (evidence) {
        setPublicEvidences(prev => [...prev, { ...evidence, isPublic: true }]);
      }
    } catch (e) {
      setError('出示证物失败');
    } finally {
      setLoading(false);
    }
  }, [sessionId, evidences]);

  return {
    evidences,
    publicEvidences,
    discoverEvidence,
    presentEvidence,
    loadEvidences,
    loading,
    error,
  };
}
