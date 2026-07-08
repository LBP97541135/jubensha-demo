/**
 * 会话 API
 *
 * 游戏会话的创建、查询、快照、结束等操作。
 */
import { apiClient } from './client';

export interface SessionVoteResult {
  success: boolean;
  is_correct?: boolean;
  message?: string;
}

export interface AgentVoteResult {
  agent_votes?: Array<{ role: string; killer: string; motive?: string }>;
  tallies?: Record<string, number>;
}

export interface SnapshotData {
  success: boolean;
  frontend_phase_index?: number;
  player_character_name?: string;
  role_evidences?: Record<string, any[]>;
  evidences?: any[];
  public_evidences?: any[];
  vote_result?: any;
  reveal_data?: {
    killer_confession?: string;
    truth?: string;
    vote_correct?: boolean;
    accused_killer?: string;
  };
}

export interface ScriptContent {
  chapters: Array<{ title: string; content: string }>;
}

export const sessionsApi = {
  /** 创建游戏会话 */
  create: (scriptId: string, title?: string) =>
    apiClient.post('/sessions', { script_id: scriptId, title }),

  /** 获取会话详情 */
  get: (sessionId: string) =>
    apiClient.get(`/sessions/${sessionId}`),

  /** 获取会话快照（服务端主状态） */
  getSnapshot: (sessionId: string) =>
    apiClient.get<SnapshotData>(`/sessions/${sessionId}/snapshot`),

  /** 结束会话 */
  end: (sessionId: string) =>
    apiClient.post(`/sessions/${sessionId}/end`),

  /** 提交投票 */
  vote: (sessionId: string, killer: string, motive: string, voter?: string) =>
    apiClient.post<SessionVoteResult>(`/sessions/${sessionId}/vote`, {
      voter_id: voter || 'player',
      target_id: killer,
      reason: motive,
    }),

  /** 提交 Agent 投票 */
  submitAgentVotes: (sessionId: string) =>
    apiClient.post<AgentVoteResult>(`/sessions/${sessionId}/vote/agents`),

  /** 获取角色私人剧本 */
  getMyScript: (sessionId: string, characterName: string) =>
    apiClient.get<ScriptContent>(`/sessions/${sessionId}/my-script`, {
      character_name: characterName,
    }),

  /** 揭示真相 */
  reveal: (sessionId: string) =>
    apiClient.post(`/sessions/${sessionId}/reveal`),

  /** 游戏复盘 */
  reflect: (sessionId: string, data: Record<string, any>) =>
    apiClient.post(`/sessions/${sessionId}/reflect`, data),

  /** 生成结局故事 */
  generateSpoiler: (sessionId: string, data: Record<string, any>) =>
    apiClient.post(`/sessions/${sessionId}/spoiler`, data),

  /** 获取 Agent 状态 */
  getAgentState: (sessionId: string, agentKey: string) =>
    apiClient.get(`/sessions/${sessionId}/agent-state/${agentKey}`),

  /** 获取证物池 */
  getEvidencePool: (scriptId: string) =>
    apiClient.get(`/scripts/${scriptId}/evidence-pool`),

  /** 保存前端状态 */
  saveState: (sessionId: string, data: {
    phase_index?: number;
    introduced?: string[];
    selected_role?: string;
    vote_submitted?: boolean;
    reveal_data?: any;
  }) =>
    apiClient.post(`/sessions/${sessionId}/state`, data),

  /** 注入 Skill */
  injectSkills: (sessionId: string, data: {
    agent_id?: string;
    role?: string;
    phase?: string;
    skill_ids?: string[];
    skill_id?: string;
    max_tokens?: number;
  }) =>
    apiClient.post(`/sessions/${sessionId}/skills/inject`, data),

  /** Skill 反馈 */
  skillFeedback: (sessionId: string, data: {
    skill_id: string;
    quality: number;
  }) =>
    apiClient.post(`/sessions/${sessionId}/skills/feedback`, data),
};
