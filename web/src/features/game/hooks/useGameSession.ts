import React from "react";
import { sessionsApi, phasesApi, castingApi, evidencesApi, messagesApi, aiApi, integrationsApi } from "../../../api";

export interface GameSessionState {
  sessionId: string;
  scriptId: string;
  scriptTitle: string;
  currentPhase: string;
  casts: any[];
  evidences: any[];
  publicEvidences: any[];
  messages: any[];
  personas: any[];
  aiStatus: any;
  integrationStatus: any;
  isLoading: boolean;
  error: string | null;
}

export interface UseGameSessionReturn {
  state: GameSessionState;
  refreshSession: () => Promise<void>;
  advancePhase: () => Promise<void>;
  forcePhase: (phase: string) => Promise<void>;
  setCasting: (casts: any[]) => Promise<void>;
  getCasting: () => Promise<void>;
  getEvidences: () => Promise<void>;
  getPublicEvidences: () => Promise<void>;
  getMessages: () => Promise<void>;
  sendMessage: (content: string, senderType: string, senderId: string, senderName: string) => Promise<void>;
  vote: (killer: string, motive: string) => Promise<void>;
  reveal: () => Promise<void>;
  end: () => Promise<void>;
}

export function useGameSession(sessionId: string): UseGameSessionReturn {
  const [state, setState] = React.useState<GameSessionState>({
    sessionId: sessionId || "",
    scriptId: "",
    scriptTitle: "",
    currentPhase: "setup",
    casts: [],
    evidences: [],
    publicEvidences: [],
    messages: [],
    personas: [],
    aiStatus: null,
    integrationStatus: null,
    isLoading: false,
    error: null,
  });

  const setLoading = (loading: boolean) => {
    setState((prev) => ({ ...prev, isLoading: loading }));
  };

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  };

  const refreshSession = React.useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const [session, phase, castingResult, evidencesResult, publicEvidencesResult, messagesResult, aiStatus, integrationStatus] = await Promise.all([
        sessionsApi.get(sessionId),
        phasesApi.getCurrent(sessionId),
        castingApi.get(sessionId).catch(() => ({ casts: [] })),
        evidencesApi.getAll(sessionId).catch(() => ({ evidences: [] })),
        evidencesApi.getPublic(sessionId).catch(() => ({ public_evidences: [] })),
        messagesApi.get(sessionId).catch(() => ({ messages: [] })),
        aiApi.getStatus().catch(() => null),
        integrationsApi.getStatus().catch(() => null),
      ]);
      setState((prev) => ({
        ...prev,
        scriptId: session.script_id || "",
        scriptTitle: session.title || "",
        currentPhase: phase.phase || "setup",
        casts: castingResult.casts || [],
        evidences: evidencesResult.evidences || [],
        publicEvidences: publicEvidencesResult.public_evidences || [],
        messages: messagesResult.messages || [],
        aiStatus,
        integrationStatus,
      }));
    } catch (error) {
      setError(`刷新会话失败：${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const advancePhase = React.useCallback(async () => {
    if (!sessionId) return;
    try {
      const result = await phasesApi.advance(sessionId);
      setState((prev) => ({
        ...prev,
        currentPhase: result.to_phase || prev.currentPhase,
      }));
      return result;
    } catch (error) {
      setError(`推进阶段失败：${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }, [sessionId]);

  const forcePhase = React.useCallback(async (phase: string) => {
    if (!sessionId) return;
    try {
      const result = await phasesApi.force(sessionId, phase);
      setState((prev) => ({
        ...prev,
        currentPhase: result.to_phase || phase,
      }));
      return result;
    } catch (error) {
      setError(`强制跳转阶段失败：${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }, [sessionId]);

  const setCasting = React.useCallback(async (casts: any[]) => {
    if (!sessionId) return;
    try {
      await castingApi.set(sessionId, casts);
      await getCasting();
    } catch (error) {
      setError(`设置选角失败：${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }, [sessionId]);

  const getCasting = React.useCallback(async () => {
    if (!sessionId) return;
    try {
      const result = await castingApi.get(sessionId);
      setState((prev) => ({
        ...prev,
        casts: result.casts || [],
      }));
    } catch (error) {
      setError(`获取选角失败：${error instanceof Error ? error.message : String(error)}`);
    }
  }, [sessionId]);

  const getEvidences = React.useCallback(async () => {
    if (!sessionId) return;
    try {
      const result = await evidencesApi.getAll(sessionId);
      setState((prev) => ({
        ...prev,
        evidences: result.evidences || [],
      }));
    } catch (error) {
      setError(`获取证物失败：${error instanceof Error ? error.message : String(error)}`);
    }
  }, [sessionId]);

  const getPublicEvidences = React.useCallback(async () => {
    if (!sessionId) return;
    try {
      const result = await evidencesApi.getPublic(sessionId);
      setState((prev) => ({
        ...prev,
        publicEvidences: result.public_evidences || [],
      }));
    } catch (error) {
      setError(`获取公开证物失败：${error instanceof Error ? error.message : String(error)}`);
    }
  }, [sessionId]);

  const getMessages = React.useCallback(async () => {
    if (!sessionId) return;
    try {
      const result = await messagesApi.get(sessionId);
      setState((prev) => ({
        ...prev,
        messages: result.messages || [],
      }));
    } catch (error) {
      setError(`获取消息失败：${error instanceof Error ? error.message : String(error)}`);
    }
  }, [sessionId]);

  const sendMessage = React.useCallback(async (content: string, senderType: string, senderId: string, senderName: string) => {
    if (!sessionId) return;
    try {
      await messagesApi.send(sessionId, content, "", senderType, senderId, senderName);
      await getMessages();
    } catch (error) {
      setError(`发送消息失败：${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }, [sessionId]);

  const vote = React.useCallback(async (killer: string, motive: string) => {
    if (!sessionId) return;
    try {
      const result = await sessionsApi.vote(sessionId, killer, motive);
      return result;
    } catch (error) {
      setError(`投票失败：${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }, [sessionId]);

  const reveal = React.useCallback(async () => {
    if (!sessionId) return;
    try {
      const result = await sessionsApi.reveal(sessionId);
      return result;
    } catch (error) {
      setError(`揭示真相失败：${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }, [sessionId]);

  const end = React.useCallback(async () => {
    if (!sessionId) return;
    try {
      await sessionsApi.end(sessionId);
    } catch (error) {
      setError(`结束会话失败：${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }, [sessionId]);

  React.useEffect(() => {
    if (sessionId) {
      refreshSession();
    }
  }, [sessionId, refreshSession]);

  return {
    state,
    refreshSession,
    advancePhase,
    forcePhase,
    setCasting,
    getCasting,
    getEvidences,
    getPublicEvidences,
    getMessages,
    sendMessage,
    vote,
    reveal,
    end,
  };
}
