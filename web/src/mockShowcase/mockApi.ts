import type { AgentInfo, AgentPersona, BackendScript } from "../api/legacy-types";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

const SESSION_KEY = "mock-showcase:sessions";
const DEFAULT_SESSION_ID = "mock-session-xiutie-avenue";

const characters = [
  { id: "zhouye", name: "周野", role: "周野", publicIdentity: "废弃厂区维修员" },
  { id: "guchen", name: "顾沉", role: "顾沉", publicIdentity: "事故档案管理员" },
  { id: "shenhe", name: "沈禾", role: "沈禾", publicIdentity: "调查记者" },
  { id: "zhoulan", name: "周岚", role: "周岚", publicIdentity: "夜班护士" },
  { id: "qinye", name: "秦野", role: "秦野", publicIdentity: "厂区前工头" },
  { id: "linyuan", name: "林远", role: "林远", publicIdentity: "旧保安" },
];

const script: BackendScript = {
  id: "xiutie-avenue-missing-three-minutes",
  title: "锈铁大道：消失的三分钟",
  description:
    "十二年前，锈铁大道旧厂区发生坠亡事故。今晚，六名当事人回到封存现场，寻找被人为抹掉的三分钟。",
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
    "顾沉为了保护旧档案中的受贿记录，篡改了值班表并关闭了门禁日志。死者发现真相后被诱至地下储物间，最终的坠亡并非单纯事故。",
  truth:
    "凶手是顾沉。动机是掩盖十二年前档案造假和事后勒索关系。",
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
    basicDescription: "顾沉的签名被覆盖，纸张背面留下维修终端的压痕编号。",
    detailedDescription: "涂改处并非十二年前形成，而是近期二次覆盖。",
    deepDescription: "值班表与门禁日志的空白区间能互相印证。",
    location: "旧值班室",
    time: "23:02",
    source: "随机搜证",
    owner_id: "guchen",
    is_public: false,
    found: false,
  },
  {
    id: "oil-key",
    name: "沾有机油的钥匙",
    basicDescription: "钥匙对应地下储物柜，齿槽里夹着红色纤维。",
    detailedDescription: "红色纤维与档案袋封绳材质接近。",
    deepDescription: "钥匙不是死者携带，而是有人事后丢进排水沟。",
    location: "排水沟",
    time: "23:06",
    source: "随机搜证",
    owner_id: "qinye",
    is_public: false,
    found: false,
  },
  {
    id: "nurse-note",
    name: "夜班护士记录",
    basicDescription: "周岚记录过一名拒绝登记的伤者，时间是 22:45。",
    detailedDescription: "伤者手腕有金属划伤，像是强行拉开储物柜留下的。",
    deepDescription: "伤者不可能是坠亡者本人，说明现场至少有第二名受伤者。",
    location: "旧诊所抽屉",
    time: "22:45",
    source: "角色线索",
    owner_id: "zhoulan",
    is_public: false,
    found: false,
  },
];

const roleScripts: Record<string, Array<{ title: string; content: string }>> = {
  周野: [
    {
      title: "第一章：重返锈铁大道",
      content:
        "你曾负责厂区门禁维护。事故发生后，有人付钱让你删除一段记录。今晚那张折断的访客卡再次出现，证明删除并不完整。",
    },
    {
      title: "第二章：不能公开的交易",
      content:
        "你知道维修终端钥匙当晚不在你手里。你的任务是找回原始记录，同时避免过早暴露自己参与删改数据。",
    },
  ],
  顾沉: [
    {
      title: "第一章：档案室的空白页",
      content:
        "你保管事故档案多年。缺页不是意外，而是你为了保护某个人，也保护自己，选择留下的空洞。",
    },
    {
      title: "第二章：被覆盖的签名",
      content:
        "值班表上有你的签名。你必须让所有人相信，那只是档案交接时留下的正常痕迹。",
    },
  ],
};

type MockSession = {
  id: string;
  script_id: string;
  title: string;
  current_phase: string;
  phase_index: number;
  casts: any[];
  evidences: any[];
  public_evidences: any[];
  messages: any[];
  vote_result?: any;
  reveal_data?: any;
};

const phases = ["setup", "role-selection", "script-reading", "intro", "search", "discussion", "vote", "reveal", "review"];

function readSessions(): Record<string, MockSession> {
  try {
    return JSON.parse(window.localStorage.getItem(SESSION_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeSessions(sessions: Record<string, MockSession>) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
}

function defaultCasts() {
  return characters.map((character, index) => ({
    id: `cast-${character.id}`,
    character_id: character.id,
    role: character.role,
    role_name: character.role,
    actor_type: index === 0 ? "human" : "agent",
    actor_id: index === 0 ? "player" : agents[(index - 1) % agents.length].key,
    is_player: index === 0,
  }));
}

function ensureSession(sessionId = DEFAULT_SESSION_ID): MockSession {
  const sessions = readSessions();
  if (!sessions[sessionId]) {
    sessions[sessionId] = {
      id: sessionId,
      script_id: script.id,
      title: script.title,
      current_phase: "role-selection",
      phase_index: 1,
      casts: defaultCasts(),
      evidences: evidencePool.slice(0, 1),
      public_evidences: [],
      messages: [
        {
          id: "msg-opening",
          sender_name: "雾港主理人",
          sender_type: "system",
          content: "锈铁大道重新开门。所有人的证词，都必须回到那消失的三分钟。",
          created_at: new Date().toISOString(),
        },
      ],
    };
    writeSessions(sessions);
  }
  return sessions[sessionId];
}

function saveSession(session: MockSession) {
  const sessions = readSessions();
  sessions[session.id] = session;
  writeSessions(sessions);
}

function asEvidence(item: any) {
  return {
    ...item,
    description: item.basicDescription,
    detailedDescription: item.detailedDescription,
    deepDescription: item.deepDescription,
    visibility: item.is_public ? "公开" : "仅自己",
  };
}

function nextScriptedSpeech(body: any) {
  const name = body?.actor?.name || body?.role || body?.speaker || "角色";
  const prompt = String(body?.prompt || body?.messages?.at?.(-1)?.content || "");
  if (prompt.includes("自我介绍")) {
    return `${name}压低声音说：我回到这里不是为了怀旧。十二年前那晚，有人把时间表剪掉了一块，我想知道是谁拿走了那三分钟。`;
  }
  if (prompt.includes("质问") || prompt.includes("追问")) {
    return `${name}停顿片刻：这个问题我能回答一半。22:43 我听见过地下储物间的门响，但我不能证明进去的人是谁。`;
  }
  return `${name}看向桌上的线索：访客卡、值班表和那把钥匙不该同时出现。它们指向同一个动作：有人在事故后回到现场补了一刀。`;
}

export function isMockShowcaseMode() {
  return true;
}

export async function mockApiRequest<T>(method: Method, rawPath: string, body?: any): Promise<T> {
  const url = new URL(rawPath, "http://mock.local");
  const path = url.pathname;
  const parts = path.split("/").filter(Boolean);

  await new Promise((resolve) => window.setTimeout(resolve, 120));

  if (method === "GET" && path === "/ai/status") {
    return {
      service: "mock-showcase",
      model: "scripted-local",
      available: false,
      fallback_mode: "LOCAL_ONLY",
      api_key_configured: false,
    } as T;
  }

  if (method === "GET" && path === "/integrations/status") {
    return { evomap: { enabled: false }, skill_runtime: { enabled: true, mode: "mock" } } as T;
  }

  if (method === "GET" && path === "/scripts") {
    return { scripts: [script] } as T;
  }

  if (method === "GET" && parts[0] === "scripts" && parts[2] === "evidence-pool") {
    const evidences = evidencePool.map(asEvidence);
    return {
      evidences,
      evidence_pool: evidences,
      all_evidences: evidences,
      search_evidences: evidences.slice(1),
      role_evidences: { 周野: evidences.slice(0, 1) },
    } as T;
  }

  if (method === "GET" && parts[0] === "scripts" && parts[1]) {
    return script as T;
  }

  if (method === "POST" && path === "/sessions") {
    const id = `${DEFAULT_SESSION_ID}-${Date.now()}`;
    const session = ensureSession(id);
    session.script_id = body?.script_id || script.id;
    session.title = body?.title || script.title;
    saveSession(session);
    return session as T;
  }

  if (parts[0] === "sessions" && parts[1]) {
    const session = ensureSession(parts[1]);

    if (method === "GET" && parts.length === 2) return session as T;

    if (method === "GET" && parts[2] === "snapshot") {
      return {
        success: true,
        session,
        casts: session.casts,
        frontend_phase_index: session.phase_index,
        player_character_name: "周野",
        role_evidences: { 周野: evidencePool.slice(0, 1).map(asEvidence) },
        evidences: session.evidences.map(asEvidence),
        public_evidences: session.public_evidences.map(asEvidence),
        vote_result: session.vote_result,
        reveal_data: session.reveal_data,
      } as T;
    }

    if (method === "GET" && parts[2] === "phase") return { phase: session.current_phase } as T;

    if (method === "POST" && parts[2] === "phase" && parts[3] === "advance") {
      session.phase_index = Math.min(session.phase_index + 1, phases.length - 1);
      session.current_phase = phases[session.phase_index];
      saveSession(session);
      return { from_phase: phases[Math.max(0, session.phase_index - 1)], to_phase: session.current_phase } as T;
    }

    if (method === "POST" && parts[2] === "phase" && parts[3] === "force") {
      session.current_phase = body?.target_phase || session.current_phase;
      session.phase_index = Math.max(0, phases.indexOf(session.current_phase));
      saveSession(session);
      return { to_phase: session.current_phase } as T;
    }

    if (parts[2] === "cast") {
      if (method === "GET") return { casts: session.casts } as T;
      if (method === "POST") {
        session.casts = Array.isArray(body) ? body : defaultCasts();
        saveSession(session);
        return { casts: session.casts } as T;
      }
      if (method === "DELETE") {
        session.casts = [];
        saveSession(session);
        return { casts: [] } as T;
      }
    }

    if (parts[2] === "evidences") {
      if (method === "GET" && parts[3] === "public") return { public_evidences: session.public_evidences.map(asEvidence) } as T;
      if (method === "GET") return { evidences: session.evidences.map(asEvidence) } as T;
      if (method === "POST" && parts[3] === "discover") {
        const target = evidencePool.find((item) => item.id === body?.evidence_id) || evidencePool.find((item) => !session.evidences.some((e) => e.id === item.id));
        if (target && !session.evidences.some((item) => item.id === target.id)) session.evidences.push({ ...target, found: true });
        saveSession(session);
        return { evidence: target ? asEvidence(target) : null, evidences: session.evidences.map(asEvidence) } as T;
      }
      if (method === "POST" && parts[3] === "present") {
        const target = evidencePool.find((item) => item.id === body?.evidence_id) || session.evidences[0];
        if (target && !session.public_evidences.some((item) => item.id === target.id)) session.public_evidences.push({ ...target, is_public: true, found: true });
        saveSession(session);
        return { public_evidences: session.public_evidences.map(asEvidence) } as T;
      }
    }

    if (parts[2] === "messages") {
      if (method === "GET") return { messages: session.messages } as T;
      if (method === "POST") {
        const message = {
          id: `msg-${Date.now()}`,
          sender_name: body?.sender_name || "玩家",
          sender_type: body?.sender_type || "human",
          sender_id: body?.sender_id || "player",
          content: body?.content || "",
          thread_id: body?.thread_id || "",
          created_at: new Date().toISOString(),
        };
        session.messages.push(message);
        saveSession(session);
        return message as T;
      }
      if (method === "POST" && parts[3] === "threads") return { id: `thread-${Date.now()}`, ...body } as T;
      if (method === "GET" && parts[3] === "threads") return { threads: [] } as T;
    }

    if (method === "GET" && parts[2] === "my-script") {
      const characterName = url.searchParams.get("character_name") || "周野";
      return { character_name: characterName, chapters: roleScripts[characterName] || roleScripts.周野 } as T;
    }

    if (method === "POST" && parts[2] === "vote") {
      session.vote_result = { success: true, is_correct: body?.target_id === "顾沉", message: "投票已记录" };
      saveSession(session);
      return session.vote_result as T;
    }

    if (method === "POST" && parts[2] === "reveal") {
      session.reveal_data = {
        killer_confession: "我以为只要删掉三分钟，旧案就会永远停在事故两个字里。",
        truth: script.truth,
        vote_correct: session.vote_result?.is_correct ?? false,
        accused_killer: session.vote_result?.target_id || "顾沉",
      };
      saveSession(session);
      return session.reveal_data as T;
    }

    if (method === "POST" && parts[2] === "spoiler") {
      return { story: script.reveal_text, content: script.reveal_text } as T;
    }

    if (method === "POST" && parts[2] === "state") {
      if (typeof body?.phase_index === "number") {
        session.phase_index = body.phase_index;
        session.current_phase = phases[session.phase_index] || session.current_phase;
      }
      saveSession(session);
      return { success: true } as T;
    }

    if (method === "POST" && parts[2] === "skills") return { success: true, injected: body?.skill_ids || [body?.skill_id].filter(Boolean) } as T;
    if (method === "GET" && parts[2] === "agent-state") return { memory: {}, suspicion: {}, notes: [] } as T;
    if (method === "POST" && parts[2] === "end") return { success: true } as T;
    if (method === "POST" && parts[2] === "reflect") return { success: true } as T;
  }

  if (parts[0] === "agents") {
    if (method === "GET" && parts[1] === "list") return { agents } as T;
    if (method === "POST" && parts[1] === "personas" && parts[2] === "init") return { personas } as T;
    if (method === "GET" && parts[1] === "personas" && parts[2]) return personas.find((item) => item.key === parts[2]) as T;
    if (method === "GET" && parts[1] === "personas") return { personas } as T;
    if (method === "POST" && parts[1] === "personas" && parts[2] === "auto-match") return { personas } as T;
    if (method === "POST") return { success: true } as T;
  }

  if (parts[0] === "ai" || parts[0] === "assistant" || parts[0] === "invoke") {
    return { content: nextScriptedSpeech(body), text: nextScriptedSpeech(body), success: true } as T;
  }

  return { success: true } as T;
}
