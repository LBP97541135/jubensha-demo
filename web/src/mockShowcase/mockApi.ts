import type { AgentInfo, AgentPersona, BackendScript } from "../api/legacy-types";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

const SESSION_KEY = "mock-showcase:sessions";
const DEFAULT_SESSION_ID = "mock-session-xiutie-avenue";

const characters = [
  { id: "zhouye", name: "周野", role: "周野", publicIdentity: "废弃厂区维修员", isVictim: false },
  { id: "guchen", name: "顾沉", role: "顾沉", publicIdentity: "事故档案管理员", isVictim: false },
  { id: "shenhe", name: "沈禾", role: "沈禾", publicIdentity: "调查记者", isVictim: false },
  { id: "zhoulan", name: "周岚", role: "周岚", publicIdentity: "夜班护士", isVictim: false },
  { id: "qinye", name: "秦野", role: "秦野", publicIdentity: "旧厂区前工头", isVictim: false },
  { id: "linyuan", name: "林远", role: "林远", publicIdentity: "旧保安", isVictim: false },
];

const script: BackendScript = {
  id: "xiutie-avenue-missing-three-minutes",
  title: "锈铁大道：消失的三分钟",
  description:
    "十二年前，锈铁大道旧厂区发生坠亡事故。今夜，六名当事人回到封存现场，寻找被人抹掉的三分钟。",
  author: "Mock Showcase",
  genre: "现代推理",
  theme: "旧案、时间线、证词矛盾",
  difficulty: "进阶",
  player_count: 6,
  duration_minutes: 120,
  cover_image: new URL("../video_picture/首帧画面.png", import.meta.url).href,
  coverImage: new URL("../video_picture/首帧画面.png", import.meta.url).href,
  rating: 4.8,
  hot: true,
  recommended: true,
  newArrival: true,
  friendsPlayed: false,
  tags: ["旧案", "时间线", "门禁记录", "六人本"],
  emotion_level: 3,
  inference_level: 5,
  horror_level: 1,
  status: "published",
  characters,
  globalStory:
    "旧厂区监控在 22:41 到 22:44 之间出现空白。档案、访客卡、钥匙和护士记录彼此咬合，真正的凶手借事故掩盖了二次伤害。",
  reveal_text:
    "顾沉为了保护旧档案中的受贿记录，篡改了值班表并关闭门禁日志。死者发现真相后被诱至地下储物间，最终的坠亡并非单纯事故。",
  truth:
    "真凶是顾沉。动机是掩盖十二年前档案造假和事后勒索关系。他利用档案管理权限与旧门禁规则，制造了 22:41-22:44 的空白时间。",
};

const personas: AgentPersona[] = [
  {
    id: "persona-white-crow",
    key: "white-crow",
    name: "白鸽",
    role: "companion",
    vibe: "冷静、追问细节",
    voice: "克制但锋利",
    background: "擅长从证词缝隙里追出时间线矛盾。",
    skills: ["timeline_reasoning", "evidence_pressure"],
    tags: ["推理", "追问"],
    enabled: true,
  },
  {
    id: "persona-echo",
    key: "echo",
    name: "回声",
    role: "companion",
    vibe: "沉默、务实",
    voice: "短句，偏现场经验",
    background: "熟悉厂区结构，善于指出现场行动是否可行。",
    skills: ["site_memory", "worker_relations"],
    tags: ["现场", "行动线"],
    enabled: true,
  },
  {
    id: "persona-paper-owl",
    key: "paper-owl",
    name: "纸鸮",
    role: "companion",
    vibe: "谨慎、档案型",
    voice: "引用记录和编号",
    background: "会把文件、门禁、签名和物证编号串联起来。",
    skills: ["archive_reading", "document_trace"],
    tags: ["档案", "线索整理"],
    enabled: true,
  },
];

const agents: AgentInfo[] = personas.map((persona) => ({
  id: `agent-${persona.key}`,
  key: persona.key,
  name: persona.name,
  role: persona.role,
  model: "mock-local",
  persona_id: persona.id,
  persona_key: persona.key,
  registered: true,
}));

const mockSkills = [
  {
    id: "skill-timeline-pressure",
    name: "时间线压迫追问",
    title: "时间线压迫追问",
    category: "reasoning",
    status: "active",
    description: "围绕 22:41-22:44 的空白区间连续追问，让证词、门禁和行动线互相校验。",
    createdAt: "2026-07-08",
    signals: ["时间线", "门禁", "证词矛盾"],
    usageCount: 12,
  },
  {
    id: "skill-evidence-bridge",
    name: "证物桥接",
    title: "证物桥接",
    category: "evidence",
    status: "active",
    description: "把访客卡、值班表、钥匙和护士记录串成可展示的证据链。",
    createdAt: "2026-07-08",
    signals: ["证物", "关联", "公开讨论"],
    usageCount: 8,
  },
  {
    id: "skill-character-pressure",
    name: "角色动机施压",
    title: "角色动机施压",
    category: "social",
    status: "active",
    description: "在不破坏角色沉浸的前提下，用动机和隐瞒点推动嫌疑人表态。",
    createdAt: "2026-07-08",
    signals: ["动机", "隐瞒", "角色表达"],
    usageCount: 6,
  },
];

const evidencePool = [
  {
    id: "visitor-card",
    name: "折断的访客卡",
    basicDescription: "编号与失踪名单第三行一致，背面有储物柜形状的锈痕。",
    detailedDescription: "卡片断口很新，说明有人近期重新取出过它。",
    deepDescription: "访客卡对应 22:43 的门禁记录，正处于被删除的三分钟内。",
    location: "废弃宿舍门禁机",
    time: "22:47",
    source: "场景初始线索",
    owner_id: "zhouye",
    is_public: false,
    found: true,
  },
  {
    id: "duty-sheet",
    name: "被涂改的值班表",
    basicDescription: "顾沉的签名被覆盖，纸背留下维修终端的压痕编号。",
    detailedDescription: "涂改处并非十二年前形成，而是近期二次覆盖。",
    deepDescription: "值班表与门禁日志的空白区间能互相印证。",
    location: "旧值班室",
    time: "23:02",
    source: "搜证线索",
    owner_id: "guchen",
    is_public: false,
    found: false,
  },
  {
    id: "clinic-note",
    name: "夜诊所护士记录",
    basicDescription: "22:45 出现一名手腕有金属划伤的匿名伤者。",
    detailedDescription: "记录里的药品批号和旧厂区医药箱一致。",
    deepDescription: "这名伤者很可能是从现场离开的第二个人。",
    location: "旧诊所抽屉",
    time: "23:11",
    source: "搜证线索",
    owner_id: "zhoulan",
    is_public: false,
    found: false,
  },
  {
    id: "oil-key",
    name: "沾机油的地下钥匙",
    basicDescription: "钥匙齿槽里有红色封绳纤维，与档案袋封口一致。",
    detailedDescription: "钥匙可以打开地下储物间，那里靠近坠亡点下方。",
    deepDescription: "凶手必须熟悉旧厂区钥匙规则，才能在三分钟内完成转移。",
    location: "排水沟",
    time: "23:20",
    source: "深搜线索",
    owner_id: "qinye",
    is_public: false,
    found: false,
  },
];

const phases = ["setup", "role-selection", "script-reading", "intro", "search", "discussion", "vote", "reveal", "review"];

type MockSession = {
  id: string;
  script_id: string;
  script_title: string;
  current_phase: string;
  phase_index: number;
  role?: string;
  cast?: any;
  evidences: typeof evidencePool;
  public_evidences: typeof evidencePool;
  messages: any[];
  vote_result?: any;
  reveal_data?: any;
};

function asEvidence(item: (typeof evidencePool)[number]) {
  return {
    id: item.id,
    name: item.name,
    title: item.name,
    description: item.basicDescription,
    basic_description: item.basicDescription,
    detailed_description: item.detailedDescription,
    deep_description: item.deepDescription,
    location: item.location,
    time: item.time,
    source: item.source,
    owner_id: item.owner_id,
    is_public: item.is_public,
    found: item.found,
  };
}

function loadSessions(): Record<string, MockSession> {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveSession(session: MockSession) {
  const sessions = loadSessions();
  sessions[session.id] = session;
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
}

function getSession(id = DEFAULT_SESSION_ID): MockSession {
  const sessions = loadSessions();
  if (sessions[id]) return sessions[id];
  const session: MockSession = {
    id,
    script_id: script.id,
    script_title: script.title,
    current_phase: "setup",
    phase_index: 0,
    role: "周野",
    evidences: [evidencePool[0]],
    public_evidences: [],
    messages: [],
  };
  saveSession(session);
  return session;
}

function reviewBundle(sessionId: string) {
  return {
    success: true,
    session_id: sessionId,
    script_title: script.title,
    truth_killer: "顾沉",
    truth_review: {
      truth_narrative: script.truth,
      discussion_critique: "关键突破在于把访客卡、值班表、钥匙和护士记录放到同一条时间线里。",
      key_lessons: ["先定时间线，再看动机", "证物要跨来源互证", "不要忽略证词里的沉默和改口"],
      vote_analysis: "正确投顾沉需要识别值班表二次涂改和地下储物间钥匙之间的关系。",
    },
    character_scores: [
      { role_name: "周野", compositeScore: 86, dimensions: { evidenceCount: 80, clueMastery: 88, logicClarity: 86, activity: 82, progress: 88, roleImmersion: 85, collaboration: 84, reasoningAccuracy: 90 }, dmComment: "抓住了门禁记录缺口，是推进真相的关键。" },
      { role_name: "顾沉", compositeScore: 78, dimensions: { evidenceCount: 72, clueMastery: 80, logicClarity: 76, activity: 79, progress: 75, roleImmersion: 88, collaboration: 68, reasoningAccuracy: 70 }, dmComment: "隐藏动机表达稳定，但被值班表细节压住。" },
      { role_name: "沈禾", compositeScore: 84, dimensions: { evidenceCount: 82, clueMastery: 86, logicClarity: 85, activity: 88, progress: 83, roleImmersion: 84, collaboration: 82, reasoningAccuracy: 84 }, dmComment: "很好地把匿名信和访客卡联系起来。" },
    ],
    skills: mockSkills.map((skill) => ({ ...skill, content: skill.description, score: 88 })),
    experiences: [
      { id: "exp-1", agent_name: "白鸽", summary: "持续追问门禁空白", detail: "把三分钟空白作为全局锚点反复校验。", category: "reasoning", score: 90 },
      { id: "exp-2", agent_name: "纸鸮", summary: "证据链整理", detail: "用值班表压痕连接档案室与维修终端。", category: "evidence", score: 86 },
    ],
    evolution_summary: { experiences_created: 2, skills_created: 3, skills_stored: 3, errors: [] },
  };
}

function nextSpeech(body?: any) {
  const name = body?.speaker || body?.agent_name || "白鸽";
  return `${name}：我会先盯住 22:41 到 22:44 的空白，把门禁、值班表和钥匙放在同一条线上核对。`;
}

export function isMockShowcaseMode() {
  return true;
}

export async function mockApiRequest<T>(method: Method, rawPath: string, body?: any): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, 80));
  const url = new URL(rawPath, "http://mock.local");
  const parts = url.pathname.replace(/^\/api\//, "").replace(/^\//, "").split("/").filter(Boolean);

  if (parts[0] === "health") return { ok: true } as T;

  if (parts[0] === "scripts") {
    if (method === "GET" && parts.length === 1) return { scripts: [script], items: [script], total: 1 } as T;
    if (method === "GET" && parts[1] === script.id && parts[2] === "evidence-pool") {
      const evidences = evidencePool.map(asEvidence);
      return { evidences, evidence_pool: evidences, all_evidences: evidences, search_evidences: evidences, role_evidences: { 周野: [evidences[0]] } } as T;
    }
    if (method === "GET") return script as T;
  }

  if (parts[0] === "sessions") {
    if (method === "POST" && parts.length === 1) {
      const id = `mock-session-${Date.now()}`;
      const session = getSession(id);
      session.script_id = body?.script_id || script.id;
      session.cast = body?.cast;
      saveSession(session);
      return { id, session_id: id, ...session } as T;
    }

    const session = getSession(parts[1] || DEFAULT_SESSION_ID);

    if (method === "GET" && parts.length === 2) return session as T;
    if (method === "GET" && parts[2] === "snapshot") {
      return {
        ...session,
        script,
        role: session.role,
        evidences: session.evidences.map(asEvidence),
        public_evidences: session.public_evidences.map(asEvidence),
        vote_result: session.vote_result,
        reveal_data: session.reveal_data,
      } as T;
    }
    if (method === "POST" && parts[2] === "state") {
      if (typeof body?.phase_index === "number") {
        session.phase_index = body.phase_index;
        session.current_phase = phases[session.phase_index] || session.current_phase;
      }
      if (body?.reveal_data) session.reveal_data = body.reveal_data;
      saveSession(session);
      return { success: true } as T;
    }
    if (method === "POST" && parts[2] === "vote" && parts[3] === "agents") return { agent_votes: [], tallies: {} } as T;
    if (method === "POST" && parts[2] === "vote") {
      session.vote_result = { success: true, is_correct: body?.target_id === "顾沉", target_id: body?.target_id, message: "投票已记录" };
      saveSession(session);
      return session.vote_result as T;
    }
    if (method === "POST" && parts[2] === "reveal") {
      session.reveal_data = {
        killer_confession: "我以为只要删掉那三分钟，所有人都会继续相信这只是一次旧厂事故。",
        truth: script.truth,
        vote_correct: session.vote_result?.is_correct ?? false,
        accused_killer: session.vote_result?.target_id || "顾沉",
      };
      saveSession(session);
      return session.reveal_data as T;
    }
    if (method === "POST" && parts[2] === "spoiler") return { story: script.reveal_text, content: script.reveal_text } as T;
    if (method === "GET" && parts[2] === "my-script") {
      return { character_name: url.searchParams.get("character_name") || "周野", chapters: [{ title: "角色剧本", content: script.globalStory }] } as T;
    }
    if (parts[2] === "evidences") {
      if (method === "GET") return { evidences: session.evidences.map(asEvidence) } as T;
      if (method === "POST") {
        const target = evidencePool.find((item) => item.id === body?.evidence_id) || evidencePool.find((item) => !session.evidences.some((e) => e.id === item.id)) || evidencePool[0];
        if (!session.evidences.some((item) => item.id === target.id)) session.evidences.push(target);
        saveSession(session);
        return asEvidence(target) as T;
      }
    }
    if (parts[2] === "public-evidences") {
      if (method === "GET") return { public_evidences: session.public_evidences.map(asEvidence) } as T;
      if (method === "POST") {
        const target = evidencePool.find((item) => item.id === body?.evidence_id) || session.evidences[0];
        if (target && !session.public_evidences.some((item) => item.id === target.id)) session.public_evidences.push(target);
        saveSession(session);
        return { success: true, evidence: target ? asEvidence(target) : null } as T;
      }
    }
    if (parts[2] === "messages") {
      if (method === "GET") return { messages: session.messages } as T;
      if (method === "POST") {
        const message = { id: `msg-${Date.now()}`, ...body, created_at: new Date().toISOString() };
        session.messages.push(message);
        saveSession(session);
        return message as T;
      }
    }
    if (parts[2] === "review") return reviewBundle(session.id) as T;
    if (parts[2] === "skills") return { success: true, injected: body?.skill_ids || [body?.skill_id].filter(Boolean) } as T;
    if (parts[2] === "agent-state") return { memory: {}, suspicion: {}, notes: [] } as T;
    if (parts[2] === "end" || parts[2] === "reflect") return { success: true } as T;
  }

  if (parts[0] === "phases") {
    const session = getSession(parts[1] || DEFAULT_SESSION_ID);
    if (method === "POST" && parts[2] === "force") {
      session.current_phase = body?.phase || body?.phase_id || session.current_phase;
      session.phase_index = Math.max(0, phases.indexOf(session.current_phase));
      saveSession(session);
      return { success: true, current_phase: session.current_phase } as T;
    }
    if (method === "POST" && parts[2] === "advance") {
      session.phase_index = Math.min(phases.length - 1, session.phase_index + 1);
      session.current_phase = phases[session.phase_index];
      saveSession(session);
      return { success: true, current_phase: session.current_phase, reveal: session.current_phase === "reveal" ? session.reveal_data : undefined } as T;
    }
  }

  if (parts[0] === "agents") {
    if (method === "GET" && parts[1] === "list") return { agents } as T;
    if (parts[1] === "personas") return { personas } as T;
    return { success: true } as T;
  }

  if (parts[0] === "skills") {
    if (method === "GET" && parts.length === 1) {
      const category = url.searchParams.get("category") || "";
      return (category ? mockSkills.filter((skill) => skill.category === category) : mockSkills) as T;
    }
    if (method === "POST" && parts[1] === "search") return { skills: mockSkills } as T;
    if (method === "GET" && parts[1]) return (mockSkills.find((skill) => skill.id === parts[1]) || mockSkills[0]) as T;
    return { success: true } as T;
  }

  if (parts[0] === "ai" || parts[0] === "assistant" || parts[0] === "invoke") {
    return { content: nextSpeech(body), text: nextSpeech(body), success: true } as T;
  }

  return { success: true } as T;
}
