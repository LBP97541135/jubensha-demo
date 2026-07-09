import { API_URL } from "../constants";
import { isMockShowcaseMode } from "../mockShowcase/mockApi";

async function request<T>(path: string, options: RequestInit = {}, timeoutMs = 600000): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
    if (!response.ok) {
      throw new Error(`${path} 返回 ${response.status}`);
    }
    return response.json() as Promise<T>;
  } finally {
    window.clearTimeout(timer);
  }
}

export type ScoreDimensionKey =
  | "evidenceCount"
  | "clueMastery"
  | "logicClarity"
  | "activity"
  | "progress"
  | "roleImmersion"
  | "collaboration"
  | "reasoningAccuracy";

export interface CharacterScore {
  role_name: string;
  agent_key?: string;
  agent_name?: string;
  participant_type?: string;
  compositeScore: number;
  dimensions: Record<ScoreDimensionKey, number>;
  dmComment: string;
}

export interface TruthReview {
  truth_narrative?: string;
  discussion_critique?: string;
  key_lessons?: string[];
  vote_analysis?: string;
}

export interface ReviewExperience {
  id?: string;
  experience_id?: string;
  agent_key?: string;
  agent_name?: string;
  summary?: string;
  detail?: string;
  category?: string;
  score?: number;
  dmScore?: number;
  dmComment?: string;
  dmSuggestions?: string;
  skillId?: string;
}

export interface ReviewSkill {
  id: string;
  title: string;
  category?: string;
  publisherRole?: string;
  agent_key?: string;
  agent_name?: string;
  score?: number;
  content?: string;
  strategy?: string;
  signals?: string[];
  usageCount?: number;
  createdAt?: string;
  stored_in_db?: boolean;
  reviewStatus?: string;
  experienceId?: string;
}

export interface GameReviewBundle {
  success?: boolean;
  session_id?: string;
  script_title?: string;
  truth_killer?: string;
  truth_review?: TruthReview;
  character_scores?: CharacterScore[];
  score_dimensions?: Array<{ key: string; label: string; description: string }>;
  skills?: ReviewSkill[];
  experiences?: ReviewExperience[];
  evolution_summary?: {
    experiences_created?: number;
    skills_created?: number;
    skills_stored?: number;
    errors?: string[];
  };
  message?: string;
  review_status?: string;
}

const mockReviewBundle: GameReviewBundle = {
  success: true,
  session_id: "mock-session-xiutie-avenue",
  script_title: "锈铁大道：消失的三分钟",
  truth_killer: "顾沉",
  truth_review: {
    truth_narrative:
      "顾沉为了掩盖十二年前档案造假与勒索关系，利用自己掌握档案和旧门禁规则的便利，诱导死者进入地下储物间。22:41-22:44 的门禁空白不是设备故障，而是人为断电和日志覆盖共同造成的遮蔽。",
    discussion_critique:
      "本局关键突破口在于把访客卡、值班表、钥匙和护士记录放到同一条时间线上。多个证物的时间点重叠后，空白三分钟变成了明确行动窗口。",
    key_lessons: ["先定时间线，再看动机", "证物要跨来源互证", "不要忽略证词里的沉默和改口"],
    vote_analysis: "正确投顾沉需要识别值班表二次涂改和地下储物间钥匙之间的关系。",
  },
  character_scores: [
    { role_name: "周野", compositeScore: 86, dimensions: { evidenceCount: 80, clueMastery: 88, logicClarity: 86, activity: 82, progress: 88, roleImmersion: 85, collaboration: 84, reasoningAccuracy: 90 }, dmComment: "抓住了门禁记录缺口，是推进真相的关键。" },
    { role_name: "顾沉", compositeScore: 78, dimensions: { evidenceCount: 72, clueMastery: 80, logicClarity: 76, activity: 79, progress: 75, roleImmersion: 88, collaboration: 68, reasoningAccuracy: 70 }, dmComment: "隐藏动机表达稳定，但被值班表细节压住。" },
    { role_name: "沈禾", compositeScore: 84, dimensions: { evidenceCount: 82, clueMastery: 86, logicClarity: 85, activity: 88, progress: 83, roleImmersion: 84, collaboration: 82, reasoningAccuracy: 84 }, dmComment: "很好地把匿名信和访客卡联系起来。" },
  ],
  skills: [
    { id: "skill-timeline-pressure", title: "时间线压迫追问", category: "reasoning", score: 90, content: "围绕 22:41-22:44 的空白区间连续追问。", signals: ["时间线", "门禁"] },
    { id: "skill-evidence-bridge", title: "证物桥接", category: "evidence", score: 86, content: "把访客卡、值班表、钥匙和护士记录串成证据链。", signals: ["证物", "关联"] },
  ],
  experiences: [
    { id: "exp-1", agent_name: "白鸽", summary: "持续追问门禁空白", detail: "把三分钟空白作为全局锚点反复校验。", category: "reasoning", score: 90 },
    { id: "exp-2", agent_name: "纸鸮", summary: "证据链整理", detail: "用值班表压痕连接档案室与维修终端。", category: "evidence", score: 86 },
  ],
  evolution_summary: { experiences_created: 2, skills_created: 2, skills_stored: 2, errors: [] },
};

export const getGameReview = (sessionId: string) =>
  isMockShowcaseMode()
    ? Promise.resolve({ ...mockReviewBundle, session_id: sessionId })
    : request<GameReviewBundle>(`/sessions/${sessionId}/review/`);

export const runGameReview = (sessionId: string) =>
  isMockShowcaseMode()
    ? Promise.resolve({ ...mockReviewBundle, session_id: sessionId })
    : request<GameReviewBundle>(`/sessions/${sessionId}/review/run`, { method: "POST" });
