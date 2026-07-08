/**
 * Agent API.
 */
import { apiClient } from './client';
import type { AgentInfo, AgentPersona } from './legacy-types';

export const agentsApi = {
  register: (data: { role: string; name: string; model: string; identityDoc?: string; constitution?: string }) =>
    apiClient.post('/agents/', data),

  list: () =>
    apiClient.get<{ agents: AgentInfo[] }>('/agents/list').then((result) => result.agents || []),

  heartbeat: (agentKey: string) =>
    apiClient.post(`/agents/heartbeat/${agentKey}`),

  evolve: (agentKey: string, data: { nodeId?: string; updateType: string; newContent: string }) =>
    apiClient.post(`/agents/evolve/${agentKey}`, data),

  initPersonas: () =>
    apiClient.post('/agents/personas/init'),

  listPersonas: (role?: string) =>
    apiClient.get<{ personas: AgentPersona[] }>('/agents/personas', role ? { role } : undefined).then((result) => result.personas || []),

  getPersona: (personaKey: string) =>
    apiClient.get<AgentPersona>(`/agents/personas/${personaKey}`),

  loadPersona: (agentKey: string, personaKey: string) =>
    apiClient.post('/agents/personas/load', { agent_key: agentKey, persona_key: personaKey }),

  autoMatchPersonas: (scriptGenre: string, difficulty: string) =>
    apiClient.post('/agents/personas/auto-match', { script_genre: scriptGenre, difficulty }),
};

export const listAgents = (): Promise<AgentInfo[]> =>
  agentsApi.list();

export const listPersonas = (): Promise<AgentPersona[]> =>
  agentsApi.listPersonas();
