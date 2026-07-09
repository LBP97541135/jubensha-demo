import type { AgentInfo, AgentPersona, BackendScript } from "../api/legacy-types";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

const SESSION_KEY = "mock-showcase:sessions";
const DEFAULT_SESSION_ID = "mock-session-xiutie-avenue";

const characters = [
  { id: "zhouye", name: "周野", role: "周野", publicIdentity: "废弃厂区维修员", context: "熟悉门禁终端和维修记录。", personality: "谨慎、负罪感", isVictim: false },
  { id: "guchen", name: "顾沉", role: "顾沉", publicIdentity: "事故档案管理员", context: "长期保管旧案档案，掌握缺页来源。", personality: "克制、防御性强", isVictim: false },
  { id: "shenhe", name: "沈禾", role: "沈禾", publicIdentity: "调查记者", context: "收到匿名信后重启旧案调查。", personality: "敏锐、执着", isVictim: false },
  { id: "zhoulan", name: "周岚", role: "周岚", publicIdentity: "夜班护士", context: "当晚见过拒绝登记的匿名伤者。", personality: "温和、回避冲突", isVictim: false },
  { id: "qinye", name: "秦野", role: "秦野", publicIdentity: "旧厂区前工头", context: "熟悉地下储物间和旧钥匙规则。", personality: "粗粝、讲义气", isVictim: false },
  { id: "linyuan", name: "林远", role: "林远", publicIdentity: "旧保安", context: "当晚巡逻记录存在离岗空白。", personality: "沉默、怕事", isVictim: false },
];

const script: BackendScript = {
  id: "xiutie-avenue-missing-three-minutes",
  title: "锈铁大道：消失的三分钟",
  description: "十二年前，锈铁大道旧厂区发生坠亡事故。今夜，六名当事人回到封存现场，寻找被人抹掉的三分钟。",
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
  globalStory: "旧厂区监控在 22:41 到 22:44 之间出现空白。档案、访客卡、钥匙和护士记录彼此咬合，真正的凶手借事故掩盖了二次伤害。",
  reveal_text: "顾沉为了保护旧档案中的受贿记录，篡改了值班表并关闭门禁日志。死者发现真相后被诱至地下储物间，最终的坠亡并非单纯事故。",
  truth: "真凶是顾沉。动机是掩盖十二年前档案造假和事后勒索关系。他利用档案管理权限与旧门禁规则，制造了 22:41-22:44 的空白时间。",
};

const personas: AgentPersona[] = [
  { id: "persona-white-crow", key: "white-crow", name: "白鸽", role: "companion", vibe: "冷静、追问细节", voice: "克制但锋利", background: "擅长从证词缝隙里追出时间线矛盾。", skills: ["timeline_reasoning"], tags: ["推理", "追问"], enabled: true },
  { id: "persona-echo", key: "echo", name: "回声", role: "companion", vibe: "沉默、务实", voice: "短句，偏现场经验", background: "熟悉厂区结构，善于指出现场行动是否可行。", skills: ["site_memory"], tags: ["现场", "行动线"], enabled: true },
  { id: "persona-paper-owl", key: "paper-owl", name: "纸鸮", role: "companion", vibe: "谨慎、档案型", voice: "引用记录和编号", background: "会把文件、门禁、签名和物证编号串联起来。", skills: ["archive_reading"], tags: ["档案", "线索整理"], enabled: true },
  { id: "persona-flint", key: "flint", name: "燧石", role: "companion", vibe: "直觉、现场压迫", voice: "短促、有攻击性", background: "擅长用现场动线逼迫嫌疑人解释矛盾。", skills: ["pressure_test"], tags: ["压迫", "动线"], enabled: true },
  { id: "persona-luna-moth", key: "luna-moth", name: "月蛾", role: "companion", vibe: "温柔、捕捉情绪", voice: "轻声但准确", background: "擅长从情绪反应里发现隐瞒。", skills: ["emotion_trace"], tags: ["情绪", "关系"], enabled: true },
  { id: "persona-shadow-weaver", key: "shadow-weaver", name: "影织者", role: "companion", vibe: "沉浸、叙事整合", voice: "低声铺陈", background: "擅长把分散证词织成完整叙事。", skills: ["story_weaving"], tags: ["叙事", "复盘"], enabled: true },
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
  { id: "skill-timeline-pressure", name: "时间线压迫追问", title: "时间线压迫追问", category: "reasoning", status: "active", description: "围绕 22:41-22:44 的空白区间连续追问，让证词、门禁和行动线互相校验。", createdAt: "2026-07-08", signals: ["时间线", "门禁", "证词矛盾"], usageCount: 12 },
  { id: "skill-evidence-bridge", name: "证物桥接", title: "证物桥接", category: "evidence", status: "active", description: "把访客卡、值班表、钥匙和护士记录串成可展示的证据链。", createdAt: "2026-07-08", signals: ["证物", "关联", "公开讨论"], usageCount: 8 },
  { id: "skill-character-pressure", name: "角色动机施压", title: "角色动机施压", category: "social", status: "active", description: "在不破坏角色沉浸的前提下，用动机和隐瞒点推动嫌疑人表态。", createdAt: "2026-07-08", signals: ["动机", "隐瞒", "角色表达"], usageCount: 6 },
];

const evidencePool = [
  { id: "visitor-card", name: "折断的访客卡", basicDescription: "编号与失踪名单第三行一致，背面有储物柜形状的锈痕。", detailedDescription: "卡片断口很新，说明有人近期重新取出过它。", deepDescription: "访客卡对应 22:43 的门禁记录，正处于被删除的三分钟内。", location: "废弃宿舍门禁机", time: "22:47", source: "场景初始线索", owner_id: "zhouye", is_public: false, found: true },
  { id: "duty-sheet", name: "被涂改的值班表", basicDescription: "顾沉的签名被覆盖，纸背留下维修终端的压痕编号。", detailedDescription: "涂改处并非十二年前形成，而是近期二次覆盖。", deepDescription: "值班表与门禁日志的空白区间能互相印证。", location: "旧值班室", time: "23:02", source: "搜证线索", owner_id: "guchen", is_public: false, found: false },
  { id: "clinic-note", name: "夜诊所护士记录", basicDescription: "22:45 出现一名手腕有金属划伤的匿名伤者。", detailedDescription: "记录里的药品批号和旧厂区医药箱一致。", deepDescription: "这名伤者很可能是从现场离开的第二个人。", location: "旧诊所抽屉", time: "23:11", source: "搜证线索", owner_id: "zhoulan", is_public: false, found: false },
  { id: "oil-key", name: "沾机油的地下钥匙", basicDescription: "钥匙齿槽里有红色封绳纤维，与档案袋封口一致。", detailedDescription: "钥匙可以打开地下储物间，那里靠近坠亡点下方。", deepDescription: "凶手必须熟悉旧厂区钥匙规则，才能在三分钟内完成转移。", location: "排水沟", time: "23:20", source: "深搜线索", owner_id: "qinye", is_public: false, found: false },
];

const phases = ["setup", "role-selection", "script-reading", "intro", "search", "discussion", "vote", "reveal", "review"];

type MockSession = {
  id: string;
  session_id: string;
  script_id: string;
  script_title: string;
  title: string;
  current_phase: string;
  phase_index: number;
  role?: string;
  cast?: any[];
  casts?: any[];
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

function defaultCasts() {
  return characters.map((character, index) => ({
    id: `cast-${character.id}`,
    character_id: character.id,
    role: character.role,
    role_name: character.role,
    actor_type: index === 0 ? "human" : "agent",
    actor_id: index === 0 ? "player" : agents[(index - 1) % agents.length].key,
    agent_key: index === 0 ? undefined : agents[(index - 1) % agents.length].key,
    is_player: index === 0,
  }));
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
  if (sessions[id]) {
    const existing = sessions[id];
    existing.title = existing.title || script.title;
    existing.script_title = existing.script_title || script.title;
    existing.session_id = existing.session_id || existing.id;
    existing.casts = existing.casts || existing.cast || defaultCasts();
    return existing;
  }
  const session: MockSession = {
    id,
    session_id: id,
    script_id: script.id,
    script_title: script.title,
    title: script.title,
    current_phase: "role-selection",
    phase_index: 1,
    role: "周野",
    cast: defaultCasts(),
    casts: defaultCasts(),
    evidences: [evidencePool[0]],
    public_evidences: [],
    messages: [],
  };
  saveSession(session);
  return session;
}

function roleScript(characterName: string) {
  const role = characters.find((item) => item.name === characterName)?.name || "周野";
  const secrets: Record<string, string> = {
    周野: "你曾负责厂区门禁维护。事故后有人让你删除一段记录，但你知道真正动过地下储物间钥匙的人不是你。",
    顾沉: "你保管事故档案多年。缺页不是意外，你必须让所有人相信值班表上的涂改只是正常交接痕迹。",
    沈禾: "你收到匿名信回到旧厂。寄信人反复提到三分钟，说明门禁空白不是系统故障。",
    周岚: "你见过 22:45 的匿名伤者。他不是死者，说明坠亡后还有第二个人从现场离开。",
    秦野: "你知道地下储物间的旧钥匙藏在哪里，也知道不熟悉厂区的人无法在三分钟内完成转移。",
    林远: "你当晚离岗过。你没看见全部过程，但听见 103 室方向传来门响。",
  };
  return {
    character_name: role,
    chapters: [
      { title: `${role} · 公开身份`, content: `${role}的公开身份：${characters.find((item) => item.name === role)?.publicIdentity || "旧厂区当事人"}。${script.globalStory}` },
      { title: `${role} · 私密线索`, content: secrets[role] || secrets.周野 },
    ],
  };
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
    character_scores: characters.slice(0, 3).map((character, index) => ({
      role_name: character.name,
      compositeScore: [86, 78, 84][index] || 82,
      dimensions: { evidenceCount: 80, clueMastery: 84, logicClarity: 82, activity: 80, progress: 82, roleImmersion: 86, collaboration: 78, reasoningAccuracy: 84 },
      dmComment: index === 1 ? "隐藏动机表达稳定，但被值班表细节压住。" : "能把关键线索接到时间线上。",
    })),
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
  if (parts[0] === "ai" && parts[1] === "status") return { available: false, fallback_mode: "LOCAL_ONLY", model: "mock-local" } as T;
  if (parts[0] === "integrations" && parts[1] === "status") return { evomap: { enabled: false }, skill_runtime: { enabled: true, mode: "mock" } } as T;

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
      session.title = body?.title || script.title;
      session.script_title = session.title;
      saveSession(session);
      return session as T;
    }

    const session = getSession(parts[1] || DEFAULT_SESSION_ID);
    if (method === "GET" && parts.length === 2) return session as T;
    if (method === "GET" && parts[2] === "phase") return { phase: session.current_phase, current_phase: session.current_phase } as T;
    if (method === "POST" && parts[2] === "phase" && parts[3] === "force") {
      session.current_phase = body?.target_phase || body?.phase || body?.phase_id || session.current_phase;
      session.phase_index = Math.max(0, phases.indexOf(session.current_phase));
      saveSession(session);
      return { success: true, to_phase: session.current_phase, current_phase: session.current_phase } as T;
    }
    if (method === "POST" && parts[2] === "phase" && parts[3] === "advance") {
      session.phase_index = Math.min(phases.length - 1, session.phase_index + 1);
      session.current_phase = phases[session.phase_index];
      saveSession(session);
      return { success: true, to_phase: session.current_phase, current_phase: session.current_phase, reveal: session.current_phase === "reveal" ? session.reveal_data : undefined } as T;
    }
    if (parts[2] === "cast") {
      if (method === "GET") return { casts: session.casts || defaultCasts() } as T;
      if (method === "POST") {
        session.casts = Array.isArray(body) ? body : defaultCasts();
        session.cast = session.casts;
        saveSession(session);
        return { casts: session.casts } as T;
      }
      if (method === "DELETE") {
        session.casts = defaultCasts();
        session.cast = session.casts;
        saveSession(session);
        return { casts: session.casts } as T;
      }
    }
    if (method === "GET" && parts[2] === "snapshot") {
      return {
        success: true,
        ...session,
        script,
        frontend_phase_index: session.phase_index,
        player_character_name: session.role || "周野",
        role_evidences: { 周野: [asEvidence(evidencePool[0])] },
        evidences: session.evidences.map(asEvidence),
        public_evidences: session.public_evidences.map(asEvidence),
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
    if (method === "GET" && parts[2] === "my-script") return roleScript(url.searchParams.get("character_name") || session.role || "周野") as T;
    if (parts[2] === "evidences") {
      if (method === "GET" && parts[3] === "public") return { public_evidences: session.public_evidences.map(asEvidence) } as T;
      if (method === "GET") return { evidences: session.evidences.map(asEvidence) } as T;
      if (method === "POST" && parts[3] === "discover") {
        const target = evidencePool.find((item) => item.id === body?.evidence_id) || evidencePool.find((item) => !session.evidences.some((e) => e.id === item.id)) || evidencePool[0];
        if (!session.evidences.some((item) => item.id === target.id)) session.evidences.push(target);
        saveSession(session);
        return { evidence: asEvidence(target), evidences: session.evidences.map(asEvidence) } as T;
      }
      if (method === "POST" && parts[3] === "present") {
        const target = evidencePool.find((item) => item.id === body?.evidence_id) || session.evidences[0];
        if (target && !session.public_evidences.some((item) => item.id === target.id)) session.public_evidences.push(target);
        saveSession(session);
        return { success: true, public_evidences: session.public_evidences.map(asEvidence) } as T;
      }
    }
    if (method === "POST" && parts[2] === "vote" && parts[3] === "agents") return { agent_votes: [], tallies: {} } as T;
    if (method === "POST" && parts[2] === "vote") {
      session.vote_result = { success: true, is_correct: body?.target_id === "顾沉", target_id: body?.target_id, message: "投票已记录" };
      saveSession(session);
      return session.vote_result as T;
    }
    if (method === "POST" && parts[2] === "reveal") {
      session.reveal_data = { killer_confession: script.reveal_text, truth: script.truth, vote_correct: session.vote_result?.is_correct ?? false, accused_killer: session.vote_result?.target_id || "顾沉" };
      saveSession(session);
      return session.reveal_data as T;
    }
    if (method === "POST" && parts[2] === "spoiler") return { story: script.reveal_text, content: script.reveal_text } as T;
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

  if (parts[0] === "ai" || parts[0] === "assistant" || parts[0] === "invoke") return { content: nextSpeech(body), text: nextSpeech(body), success: true } as T;
  return { success: true } as T;
}
