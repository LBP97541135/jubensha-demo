/**
 * EXTERNAL Murder Game - Context Providers
 *
 * 浣跨敤 constate 绠＄悊鍏ㄥ眬鐘舵€侊細鍓ф湰銆佽鑹层€佹父鎴忎細璇濄€丄gent銆?
 */

import { createContext, useContext } from "react";
import constate from "constate";
import { Actor, Script, GameSession, AgentNodeInfo } from "../types";


// ============================
// Mystery Context锛堟父鎴忔牳蹇冪姸鎬侊級
// ============================

function useMysteryState() {
  const [globalStory, setGlobalStory] = React.useState("");
  const [actors, setActors] = React.useState<Actor[]>([]);
  const [currentActorId, setCurrentActorId] = React.useState<string>("");

  return {
    globalStory, setGlobalStory,
    actors, setActors,
    currentActorId, setCurrentActorId,
  };
}

// 鈿狅笍 闇€瑕?import React
import React from "react";

export const [MysteryProvider, useMystery] = constate(useMysteryState);


// ============================
// Session Context锛堟父鎴忎細璇滻D锛?
// ============================

function useSessionState() {
  const [sessionId, setSessionId] = React.useState(() => {
    const saved = localStorage.getItem("evo_session_id");
    return saved || "";
  });

  const newSession = () => {
    const id = `ses_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setSessionId(id);
    localStorage.setItem("evo_session_id", id);
    return id;
  };

  return { sessionId, setSessionId, newSession };
}

export const [SessionProvider, useSession] = constate(useSessionState);


// ============================
// Script Context锛堝墽鏈姸鎬侊級
// ============================

function useScriptState() {
  const [script, setScript] = React.useState<Script | null>(null);
  const [scripts, setScripts] = React.useState<Script[]>([]);

  const loadScript = (s: Script) => setScript(s);
  const clearScript = () => setScript(null);

  return { script, scripts, setScripts, loadScript, clearScript };
}

export const [ScriptProvider, useScript] = constate(useScriptState);


// ============================
// Agent Context锛圓gent 鐘舵€侊級
// ============================

function useAgentState() {
  const [agents, setAgents] = React.useState<AgentNodeInfo[]>([]);
  const [currentPhase, setCurrentPhase] = React.useState("idle");

  return { agents, setAgents, currentPhase, setCurrentPhase };
}

export const [AgentProvider, useAgent] = constate(useAgentState);
