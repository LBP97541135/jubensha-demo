import type { BackendScript, EvidenceRecord } from "./legacy-types";
import type { ScriptCard } from "../pages/scriptData";
import type { Evidence } from "../types";

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&h=1500&fit=crop&auto=format";

const difficultyLabels: Record<string, ScriptCard["difficulty"]> = {
  easy: "入门",
  medium: "进阶",
  hard: "硬核",
  beginner: "入门",
  advanced: "进阶",
  expert: "硬核",
  入门: "入门",
  进阶: "进阶",
  硬核: "硬核",
};

const genreLabels: Record<string, ScriptCard["genre"]> = {
  emotional: "情感本",
  emotion: "情感本",
  mystery: "推理本",
  reasoning: "推理本",
  mechanism: "机制本",
  faction: "阵营本",
  情感本: "情感本",
  推理本: "推理本",
  机制本: "机制本",
  阵营本: "阵营本",
};

const readNumber = (source: Record<string, any>, ...keys: string[]) => {
  for (const key of keys) {
    const value = Number(source[key]);
    if (Number.isFinite(value) && value > 0) return value;
  }
  return 0;
};

const readString = (source: Record<string, any>, ...keys: string[]) => {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
};

export function backendScriptToCard(script: BackendScript): ScriptCard {
  const source = script as Record<string, any>;
  const duration = readNumber(source, "duration", "durationMinutes", "duration_minutes");
  const playerCount = readNumber(source, "playerCount", "player_count") || script.characters?.length || 0;
  const inferenceLevel = Number(source.inferenceLevel ?? source.inference_level ?? 0);
  const emotionLevel = Number(source.emotionLevel ?? source.emotion_level ?? 0);
  const horrorLevel = Number(source.horrorLevel ?? source.horror_level ?? 0);
  const createdAtRaw = readString(source, "createdAt", "created_at");
  const createdAt = createdAtRaw ? new Date(createdAtRaw).getTime() : 0;
  const isNew = createdAt > 0 && Date.now() - createdAt < 30 * 24 * 60 * 60 * 1000;
  const rating = Math.max(3.5, Math.min(5, 3.8 + inferenceLevel * 0.7 + emotionLevel * 0.5));
  const genre = readString(source, "genre") || "mystery";
  const difficulty = readString(source, "difficulty") || "medium";
  const globalStory = readString(source, "globalStory", "global_story");
  const coverImage = readString(source, "coverImage", "cover_image");
  const tags = [
    readString(source, "theme"),
    genreLabels[genre] || genre,
    inferenceLevel >= 0.7 ? "高推理" : "",
    emotionLevel >= 0.7 ? "强情感" : "",
    horrorLevel >= 0.5 ? "惊悚" : "",
  ].filter(Boolean);

  return {
    id: script.id,
    title: script.title,
    subtitle: script.author || script.version || "Backend Script",
    genre: genreLabels[genre] || "推理本",
    difficulty: difficultyLabels[difficulty] || "进阶",
    players: playerCount ? `${playerCount}人` : "人数待定",
    playerCount,
    duration: duration ? `${Math.max(1, Math.round(duration / 60))}小时` : "时长待定",
    rating,
    description: script.description || globalStory || "暂无简介",
    details: globalStory || script.description || "暂无剧本详情",
    cover: coverImage || FALLBACK_COVER,
    tags: tags.length ? tags : ["后端剧本"],
    audienceTags: [
      difficultyLabels[difficulty] === "入门" ? "新手玩家" : "推理玩家",
      playerCount >= 7 ? "大型组局" : "小型组局",
    ],
    hot: rating >= 4.6,
    newArrival: isNew,
    recommended: true,
    friendsPlayed: false,
    agentFit: [],
    roles: (script.characters || []).map((character) => String(character.name || "")).filter(Boolean),
  };
}

export function backendEvidenceToGameEvidence(evidence: EvidenceRecord): Evidence {
  const source = evidence as unknown as Record<string, any>;
  const basicDescription = readString(source, "basicDescription", "basic_description");
  const detailedDescription = readString(source, "detailedDescription", "detailed_description");
  const deepDescription = readString(source, "deepDescription", "deep_description");
  const discoveryState = readString(source, "discoveryState", "discovery_state");

  return {
    id: evidence.id,
    name: evidence.name,
    description: deepDescription || detailedDescription || basicDescription || "暂无描述",
    location: source.category || "未知位置",
    time: discoveryState || "已发现",
    source: source.importance || "后端证物",
    visibility: "仅自己",
    icon: source.category || "file",
  };
}
