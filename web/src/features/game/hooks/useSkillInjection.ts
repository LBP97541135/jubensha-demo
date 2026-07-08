/**
 * Skill 注入 hook
 *
 * 管理 Skill 的加载和注入。调用真实后端接口。
 */
import { useState, useCallback } from 'react';
import { skillsApi, sessionsApi } from '../../../api';

interface Skill {
  id: string;
  name: string;
  category: string;
  prompt_content?: string;
  signals?: string[];
}

interface InjectResult {
  prompt: string;
  injected_skills: Array<{ id: string; name: string; tokens: number }>;
  total_tokens: number;
}

export function useSkillInjection(sessionId: string | null) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loadedSkills, setLoadedSkills] = useState<Array<{ id: string; name: string; tokens: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** 加载可用 Skill 列表 */
  const loadSkills = useCallback(async (params?: { role?: string; category?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await skillsApi.search(params || {});
      setSkills(data.skills || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  /** 注入 Skills 到 Agent prompt */
  const injectSkills = useCallback(async (params: {
    agent_id?: string;
    role?: string;
    phase?: string;
    skill_ids?: string[];
  }) => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const result: InjectResult = await sessionsApi.injectSkills(sessionId, {
        agent_id: params.agent_id || '',
        role: params.role || '',
        phase: params.phase || '',
        skill_ids: params.skill_ids || skills.map(s => s.id),
      });
      setLoadedSkills(result.injected_skills || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : '注入失败');
    } finally {
      setLoading(false);
    }
  }, [sessionId, skills]);

  /** 提交 Skill 使用反馈 */
  const submitFeedback = useCallback(async (skillId: string, quality: number) => {
    if (!sessionId) return;
    try {
      await sessionsApi.skillFeedback(sessionId, { skill_id: skillId, quality });
    } catch {
      // 反馈失败不阻塞主流程
    }
  }, [sessionId]);

  return {
    skills,
    loadedSkills,
    loadSkills,
    injectSkills,
    submitFeedback,
    loading,
    error,
  };
}
