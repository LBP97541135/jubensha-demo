/**
 * EXTERNAL Murder Game - 绫诲瀷瀹氫箟
 *
 * 瀹氫箟鎵€鏈夊墠绔娇鐢ㄧ殑 TypeScript 绫诲瀷銆?
 */

// ============================
// 瑙掕壊 / Agent 绫诲瀷
// ============================

export interface Actor {
  id: string;
  name: string;
  bio: string;
  personality: string;
  context: string;
  secret: string;
  violation: string;
  image?: string;
  backgroundImage?: string;
  isVictim: boolean;
  isKiller: boolean;
  isAssistant: boolean;
  isPlayer: boolean;
  isPartner: boolean;
  roleType: string; // suspect / witness / victim / killer / assistant / partner
}

export interface SafeActor {
  id: string;
  name: string;
  bio: string;
  personality: string;
  context: string;
  image?: string;
  isVictim: boolean;
  isKiller: boolean;
  isAssistant: boolean;
  isPlayer: boolean;
  isPartner: boolean;
  roleType: string;
}

export interface LLMMessage {
  role: string;
  content: string;
}

// ============================
// Agent 鑺傜偣绫诲瀷
// ============================

export interface AgentNodeInfo {
  key: string;
  name: string;
  role: "dm" | "companion" | "assistant";
  nodeId: string;
  registered: boolean;
  model: string;
}

export interface AgentRegistration {
  nodeId: string;
  nodeSecret: string;
  claimUrl: string;
  claimCode: string;
  status: string;
}

// ============================
// 鍓ф湰绫诲瀷
// ============================

export interface Script {
  id: string;
  title: string;
  description: string;
  author: string;
  globalStory: string;
  sourceType: string;
  theme: string;
  difficulty: string;
  duration: number;
  emotionLevel: number;
  inferenceLevel: number;
  horrorLevel: number;
  playerCount: number;
  coverImage?: string;
  fixedKiller: string;
  characters: Character[];
}

export interface Character {
  id: string;
  name: string;
  bio: string;
  personality: string;
  context: string;
  secret: string;
  violation: string;
  isVictim: boolean;
  isKiller: boolean;
  isAssistant: boolean;
  isPlayer: boolean;
  isPartner: boolean;
  roleType: string;
  image?: string;
  backgroundImage?: string;
}

export interface ScriptSettings {
  theme: string;
  difficulty: string;
  duration: number;
  emotionLevel: number;
  inferenceLevel: number;
  horrorLevel: number;
  playerCount: number;
  fixedKiller: string;
}

// ============================
// 娓告垙浼氳瘽绫诲瀷
// ============================

export interface GameSession {
  sessionId: string;
  participants: string[];
  status: "active" | "paused" | "completed" | "failed";
  scriptId: string;
  topic: string;
  currentPhase: string;
}

// ============================
// 杩涘寲绫诲瀷
// ============================

export interface EvolutionRecord {
  id: string;
  agentNodeId: string;
  sessionId: string;
  signals: string[];
  status: string;
  score: number;
  summary: string;
  updateType: string;
  oldContent: string;
  newContent: string;
  createdAt: string;
}

export interface EvolutionUpdate {
  nodeId: string;
  updateType: "constitution" | "identity_doc";
  newContent: string;
}

// ============================
// 娓告垙蹇収绫诲瀷
// ============================

export interface GameSnapshot {
  session: {
    id: string;
    script_id: string;
    current_phase: string;
    status: string;
    title: string;
  };
  casts: Array<{
    id: string;
    character_id: string;
    actor_type: string;
    actor_id: string;
    role_name: string;
    is_player: boolean;
  }>;
  phase_history: Array<{
    from_phase: string;
    to_phase: string;
    reason: string;
    created_at: string;
  }>;
}

// ============================
// 娓告垙闃舵涓庣帺瀹剁被鍨?
// ============================

export type GamePhaseId =
  | "role-selection"
  | "script-reading"
  | "intro"
  | "search"
  | "discussion"
  | "vote"
  | "reveal"
  | "review";

export type PlayerStatus =
  | "绌洪棽"
  | "姝ｅ湪鍙戣█"
  | "绛夊緟鍙戣█"
  | "蹇呴』鍥炵瓟"
  | "姝ｅ湪鎬濊€?
  | "鐢宠绉佽亰"
  | "绉佽亰涓?
  | "宸插畬鎴?;

export type GamePlayer = {
  id: string;
  name: string;
  role: string;
  publicIdentity: string;
  agent: boolean;
  agentKey?: string;
  color: string;
  status: PlayerStatus;
  tags: string[];
  background: string;
};

export type Evidence = {
  id: string;
  name: string;
  description: string;
  location: string;
  time: string;
  source: string;
  visibility: "浠呰嚜宸? | "鎵€鏈変汉" | "鎸囧畾瑙掕壊";
  icon: string;
};

// ============================
// Skill 绫诲瀷
// ============================

export interface Skill {
  id: string;
  name: string;
  category: string;
  status: string;
  description: string;
  content: string;
  signals: string[];
  usageCount: number;
  effectiveness: number;
  createdAt: string;
  updatedAt: string;
}

export interface SkillSearchParams {
  role?: string;
  category?: string;
  signals?: string[];
}

export interface SkillReview {
  skillId: string;
  status: string;
  comment?: string;
}

// ============================
// Experience 绫诲瀷
// ============================

export interface Experience {
  id: string;
  sessionId: string;
  agentId: string;
  type: string;
  content: string;
  signals: string[];
  score: number;
  createdAt: string;
}

export interface ExperienceRecord {
  experienceId: string;
  sessionId: string;
  signals: string[];
  summary: string;
  score: number;
}
