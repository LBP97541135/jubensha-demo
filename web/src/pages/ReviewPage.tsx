/**
 * EXTERNAL Murder Game 鈥?澶嶇洏椤甸潰
 *
 * 涓や釜 Tab锛?
 *   1. 鍦嗘璇勫垎鐪嬫澘 鈥?1:1 澶嶅埢娓告垙閫夎鍦嗘锛孌M 灞呬腑锛岃鑹茬幆缁曪紝缁煎悎璇勫垎+缁村害璇︽儏
 *   2. 缁忛獙鎶€鑳介潰鏉?鈥?灞€鍚庣粡楠屾彁鐐间负鍙鐢ㄦ妧鑳界殑灞曠ず闈㈡澘
 */

import React from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Modal,
  Paper,
  Progress,
  RingProgress,
  Stack,
  Tabs,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconBrain,
  IconBulb,
  IconChartBar,
  IconDna,
  IconDeviceGamepad2,
  IconEye,
  IconFlame,
  IconHeart,
  IconLink,
  IconMessageCircle,
  IconSearch,
  IconStarFilled,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { GAME_PLAYERS } from "../constants/gameData";
import { scripts } from "./scriptData";
import { buildPlayPath, getStoredGameSession } from "../utils/gameNavigation";
import { skillsApi } from "../api/skills";
import { DEV_MOCK } from "../constants";
import { getGameReview, runGameReview, type CharacterScore } from "../api/reviewApi";

// ============================
// 瑙掕壊绔嬬粯
// ============================

const characterPortraits: Record<string, string> = {
  "鍛ㄩ噹": new URL("../Character/鍛ㄩ噹.png", import.meta.url).href,
  "椤炬矇": new URL("../Character/椤炬矇.png", import.meta.url).href,
  "娌堢": new URL("../Character/娌堢.png", import.meta.url).href,
  "鍛ㄥ矚": new URL("../Character/鍛ㄥ矚.png", import.meta.url).href,
  "绉﹂噹": new URL("../Character/绉﹂噹.png", import.meta.url).href,
  "鏋楄繙": new URL("../Character/鏋楄繙.png", import.meta.url).href,
};

const dmPortrait = new URL("../video_picture/闆炬腐涓荤悊浜?png", import.meta.url).href;

// ============================
// DM 璇勫垎缁村害
// ============================

type DimensionKey =
  | "evidenceCount"
  | "clueMastery"
  | "logicClarity"
  | "activity"
  | "progress"
  | "roleImmersion"
  | "collaboration"
  | "reasoningAccuracy";

interface ScoreDimension {
  key: DimensionKey;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const SCORE_DIMENSIONS: ScoreDimension[] = [
  { key: "evidenceCount", label: "鎼滆瘉鏁伴噺", icon: <IconSearch size={16} />, description: "涓诲姩鎼滅储涓庡彂鐜扮殑绾跨储鏁伴噺" },
  { key: "clueMastery", label: "绾跨储鎺屾彙搴?, icon: <IconLink size={16} />, description: "瀵圭嚎绱㈢殑鐞嗚В娣卞害涓庡叧鑱旇兘鍔? },
  { key: "logicClarity", label: "鏉＄悊娓呮櫚搴?, icon: <IconBulb size={16} />, description: "鍙戣█缁撴瀯涓庢帹鐞嗛摼瀹屾暣搴? },
  { key: "activity", label: "娲昏穬搴?, icon: <IconFlame size={16} />, description: "鍙戣█棰戠巼涓庡弬涓庤璁虹殑绉瀬鎬? },
  { key: "progress", label: "鎺ㄨ繘搴?, icon: <IconChartBar size={16} />, description: "瀵规父鎴忚繘绋嬬殑鍏抽敭鎺ㄥ姩绋嬪害" },
  { key: "roleImmersion", label: "瑙掕壊浠ｅ叆搴?, icon: <IconUserCircle size={16} />, description: "鏄惁濮嬬粓浠ヨ鑹茶韩浠借鍔ㄥ拰鍙戣█" },
  { key: "collaboration", label: "鍗忎綔搴?, icon: <IconUsers size={16} />, description: "涓庡叾浠栫帺瀹堕厤鍚堢▼搴? },
  { key: "reasoningAccuracy", label: "鎺ㄧ悊鍑嗙‘搴?, icon: <IconBrain size={16} />, description: "鏈€缁堢粨璁轰笌鐪熺浉鐨勬帴杩戠▼搴? },
];

// ============================
// 妯℃嫙澶嶇洏鏁版嵁锛堝搴?GAME_PLAYERS 涓潪 DM 鐨?6 涓鑹诧級
// ============================

interface PlayerReview {
  playerId: string;
  compositeScore: number;
  dimensions: Record<DimensionKey, number>;
  dmComment: string;
}

const MOCK_REVIEWS: PlayerReview[] = [
  {
    playerId: "user",
    compositeScore: 88,
    dimensions: { evidenceCount: 85, clueMastery: 90, logicClarity: 92, activity: 80, progress: 88, roleImmersion: 95, collaboration: 78, reasoningAccuracy: 90 },
    dmComment: "鎺ㄧ悊閾炬潯瀹屾暣锛岃鑹蹭唬鍏ユ劅鏋佸己銆傚湪鏈€鍚庢姇绁ㄩ樁娈电殑閫昏緫姊崇悊鏄叏鍦轰寒鐐广€傛悳璇佺◢鏄句繚瀹堬紝涓嬫鍙互鏇村ぇ鑳嗗湴杩介棶銆?,
  },
  {
    playerId: "chen",
    compositeScore: 72,
    dimensions: { evidenceCount: 60, clueMastery: 65, logicClarity: 70, activity: 75, progress: 68, roleImmersion: 85, collaboration: 82, reasoningAccuracy: 65 },
    dmComment: "瑙掕壊鎵紨璁ょ湡锛屼絾鎺ㄧ悊鏃跺鏄撹甯﹀亸銆傜嚎绱㈠埄鐢ㄧ巼鍋忎綆锛屽缓璁笅娆″鍏虫敞鏃堕棿绾跨煕鐩俱€?,
  },
  {
    playerId: "crow",
    compositeScore: 85,
    dimensions: { evidenceCount: 88, clueMastery: 82, logicClarity: 85, activity: 90, progress: 86, roleImmersion: 75, collaboration: 70, reasoningAccuracy: 88 },
    dmComment: "鎼滆瘉鑳藉姏鍑轰紬锛屽彂瑷€鏉＄悊娓呮櫚銆備絾鍋跺皵鎶㈣瘽锛屽缓璁粰鍏朵粬鐜╁鏇村琛ㄨ揪绌洪棿銆傛暣浣撹〃鐜颁紭绉€銆?,
  },
  {
    playerId: "su",
    compositeScore: 76,
    dimensions: { evidenceCount: 68, clueMastery: 75, logicClarity: 72, activity: 65, progress: 70, roleImmersion: 88, collaboration: 85, reasoningAccuracy: 72 },
    dmComment: "瑙掕壊鎵紨鍑鸿壊锛屾儏鎰熻〃杈捐嚜鐒躲€傛帹鐞嗗弬涓庡害鍙互鏇撮珮锛岄潰瀵硅川璇㈡椂涓嶈鎬ヤ簬鍥為伩銆?,
  },
  {
    playerId: "echo",
    compositeScore: 80,
    dimensions: { evidenceCount: 78, clueMastery: 80, logicClarity: 78, activity: 88, progress: 82, roleImmersion: 72, collaboration: 75, reasoningAccuracy: 76 },
    dmComment: "鎺ㄨ繘鑺傚绉瀬锛屾帶鍦鸿兘鍔涗笉閿欍€備絾瑙掕壊浠ｅ叆鍙互鏇存繁鍏ワ紝閬垮厤杩囦簬鍔熻兘鍖栫殑鍙戣█銆?,
  },
  {
    playerId: "lin",
    compositeScore: 68,
    dimensions: { evidenceCount: 55, clueMastery: 60, logicClarity: 65, activity: 58, progress: 62, roleImmersion: 82, collaboration: 78, reasoningAccuracy: 60 },
    dmComment: "瑙掕壊浠ｅ叆鎰熶笉閿欙紝浣嗗彂瑷€杩囦簬淇濆畧銆傛帉鎻＄殑鍏抽敭淇℃伅娌℃湁鍙婃椂鍒嗕韩锛屽缓璁笅娆℃洿涓诲姩鍦板弬涓庤璁恒€?,
  },
];

// ============================
// 缁忛獙鎶€鑳芥暟鎹粨鏋勪笌閫傞厤
// ============================

interface SkillItem {
  id: string;
  title: string;
  category: "reasoning" | "role-playing" | "hosting" | "collaboration" | "strategy";
  categoryLabel: string;
  publisherName: string;
  publisherRole: string;
  score: number;
  content: string;
  strategy: string;
  signals: string[];
  usageCount: number;
  createdAt: string;
}

// 鍚庣 Skill 瀛楁鍚嶄笌鍓嶇 SkillItem 鐨勫瓧娈垫槧灏勬墍闇€鐨勮緟鍔╁父閲?
const CATEGORY_LABELS: Record<string, string> = {
  reasoning: "鎺ㄧ悊鎶€宸?,
  "role-playing": "瑙掕壊鎵紨",
  hosting: "涓绘寔鎶€宸?,
  collaboration: "鍗忎綔鎶€宸?,
  strategy: "绛栫暐鎶€宸?,
};

const VALID_SKILL_CATEGORIES = ["reasoning", "role-playing", "hosting", "collaboration", "strategy"];

// 鏍规嵁 created_by_agent_id 鎺ㄦ柇鍙戝竷鑰呭悕绉颁笌瑙掕壊
function resolvePublisher(agentId: string): { name: string; role: string } {
  if (!agentId) return { name: "鏈煡", role: "agent" };
  const player = GAME_PLAYERS.find((p) => p.id === agentId);
  if (player) {
    return { name: player.name, role: player.id === "dm" ? "dm" : "companion" };
  }
  return { name: agentId, role: "agent" };
}

// 灏嗗悗绔?Skill 杞负鍓嶇 SkillItem 鏍煎紡
function adaptSkill(raw: any): SkillItem {
  const category = VALID_SKILL_CATEGORIES.includes(raw?.category)
    ? (raw.category as SkillItem["category"])
    : "strategy";
  const publisher = resolvePublisher(raw?.created_by_agent_id || "");
  const createdAtRaw = raw?.created_at;
  let createdAt = "";
  if (createdAtRaw) {
    const d = new Date(createdAtRaw);
    if (!isNaN(d.getTime())) {
      createdAt = d.toISOString().slice(0, 10);
    }
  }
  return {
    id: raw?.id ?? "",
    title: raw?.name ?? "",
    category,
    categoryLabel: CATEGORY_LABELS[category] || "鍏朵粬",
    publisherName: publisher.name,
    publisherRole: publisher.role,
    score: typeof raw?.quality_score === "number" ? raw.quality_score : 0,
    content: raw?.prompt_content || raw?.description || "",
    strategy: raw?.strategy || "",
    signals: Array.isArray(raw?.signals) ? raw.signals : [],
    usageCount: typeof raw?.usage_count === "number" ? raw.usage_count : 0,
    createdAt,
  };
}

// ============================
// 杈呭姪鍑芥暟
// ============================

const CATEGORY_COLORS: Record<string, string> = {
  reasoning: "blue",
  "role-playing": "grape",
  hosting: "orange",
  collaboration: "green",
  strategy: "red",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  reasoning: <IconBrain size={14} />,
  "role-playing": <IconHeart size={14} />,
  hosting: <IconStarFilled size={14} />,
  collaboration: <IconUsers size={14} />,
  strategy: <IconBulb size={14} />,
};

function getScoreColor(score: number): string {
  if (score >= 90) return "yellow";
  if (score >= 80) return "teal";
  if (score >= 70) return "blue";
  if (score >= 60) return "orange";
  return "red";
}

function getRingColor(score: number): string {
  if (score >= 90) return "#fbbf24";
  if (score >= 80) return "#2dd4bf";
  if (score >= 70) return "#60a5fa";
  if (score >= 60) return "#fb923c";
  return "#f87171";
}

function getSeatPosition(index: number, total: number) {
  const angle = -90 + (360 / total) * index;
  const radians = (angle * Math.PI) / 180;
  return {
    left: `${50 + 42 * Math.cos(radians)}%`,
    top: `${50 + 42 * Math.sin(radians)}%`,
  };
}

// ============================
// 涓婚〉闈?
// ============================

export function ReviewPage() {
  const navigate = useNavigate();
  const { id = "xiutie-avenue-missing-three-minutes" } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session") || getStoredGameSession(id);
  const scriptTitle = scripts.find((script) => script.id === id)?.title || "鏈煡鍓ф湰";

  const [reviewTab, setReviewTab] = React.useState<string | null>("table");
  const [selectedPlayerId, setSelectedPlayerId] = React.useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = React.useState<SkillItem | null>(null);

  // 鎶€鑳介潰鏉匡細浠庡悗绔?API 鍔犺浇鐪熷疄 Skill 鏁版嵁
  const [skills, setSkills] = React.useState<SkillItem[]>([]);
  const [skillsLoading, setSkillsLoading] = React.useState(false);
  const [skillsError, setSkillsError] = React.useState<string | null>(null);

  // 鐜╁璇勫垎锛氫粠鍚庣澶嶇洏 API 鍔犺浇鐪熷疄鏁版嵁锛汥EV_MOCK=true 鏃舵墠浣跨敤鏈湴 mock
  const [reviews, setReviews] = React.useState<PlayerReview[]>(
    DEV_MOCK ? MOCK_REVIEWS : [],
  );
  const [reviewsLoading, setReviewsLoading] = React.useState(false);
  const [reviewsError, setReviewsError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function loadSkills() {
      setSkillsLoading(true);
      setSkillsError(null);
      try {
        const result = await skillsApi.list<{ skills: any[] }>();
        if (cancelled) return;
        const rawSkills = Array.isArray(result?.skills) ? result.skills : [];
        setSkills(rawSkills.map(adaptSkill));
      } catch (err: any) {
        if (cancelled) return;
        setSkillsError(err?.message || "鍔犺浇鎶€鑳藉け璐?);
        setSkills([]);
      } finally {
        if (!cancelled) setSkillsLoading(false);
      }
    }
    loadSkills();
    return () => {
      cancelled = true;
    };
  }, []);

  // 鐜╁璇勫垎锛氫粠鍚庣澶嶇洏鎺ュ彛鍔犺浇鐪熷疄鏁版嵁
  React.useEffect(() => {
    if (DEV_MOCK) return; // DEV_MOCK 妯″紡涓嬩娇鐢ㄦ湰鍦?mock锛屼笉璇锋眰鍚庣
    if (!sessionId) return;
    let cancelled = false;
    async function loadReviews() {
      setReviewsLoading(true);
      setReviewsError(null);
      try {
        const bundle = await getGameReview(sessionId);
        if (cancelled) return;
        // 鍚庣杩斿洖 {success, data: {session_id, review}}锛宺eview 鍐呭惈 character_scores
        const data = (bundle as any)?.data ?? bundle;
        const review = data?.review;
        const scores: CharacterScore[] = Array.isArray(review?.character_scores)
          ? review.character_scores
          : Array.isArray(data?.character_scores)
            ? data.character_scores
            : [];
        const mapped: PlayerReview[] = scores.map((s) => ({
          playerId: s.role_name || s.agent_key || "",
          compositeScore: s.compositeScore ?? 0,
          dimensions: s.dimensions ?? ({} as Record<DimensionKey, number>),
          dmComment: s.dmComment ?? "",
        }));
        setReviews(mapped);
      } catch (err: any) {
        if (cancelled) return;
        setReviewsError(err?.message || "澶嶇洏鏁版嵁鍔犺浇澶辫触");
        setReviews([]);
      } finally {
        if (!cancelled) setReviewsLoading(false);
      }
    }
    loadReviews();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const gamePlayers = React.useMemo(() => GAME_PLAYERS.filter((p) => p.id !== "dm"), []);
  const dmPlayer = React.useMemo(() => GAME_PLAYERS.find((p) => p.id === "dm"), []);

  const getReview = (playerId: string) => reviews.find((r) => r.playerId === playerId);

  const highestScoreId = React.useMemo(() => {
    if (reviews.length === 0) return "";
    return reviews.reduce((max, r) =>
      r.compositeScore > (reviews.find((x) => x.playerId === max)?.compositeScore ?? 0) ? r.playerId : max,
      reviews[0].playerId,
    );
  }, [reviews]);

  const selectedPlayer = React.useMemo(
    () => GAME_PLAYERS.find((p) => p.id === selectedPlayerId) ?? null,
    [selectedPlayerId],
  );
  const selectedReview = React.useMemo(
    () => reviews.find((r) => r.playerId === selectedPlayerId) ?? null,
    [selectedPlayerId, reviews],
  );

  return (
    <Box
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(157, 28, 28, 0.28), transparent 26%), " +
          "radial-gradient(circle at 80% 8%, rgba(255, 181, 122, 0.08), transparent 18%), " +
          "linear-gradient(180deg, #0c0808 0%, #130d0d 42%, #090606 100%)",
      }}
    >
      <Stack gap="xl" p="lg" maw={1200} mx="auto">
        {/* 椤堕儴杩斿洖鏍?*/}
        <Group justify="space-between" wrap="wrap">
          <Group gap="xs">
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              radius="xl"
              onClick={() => navigate("/games")}
            >
              杩斿洖鎴戠殑娓告垙
            </Button>
            <Button
              variant="subtle"
              leftSection={<IconDeviceGamepad2 size={16} />}
              radius="xl"
              onClick={() => navigate(buildPlayPath(id))}
            >
              鍥炲埌瀵瑰眬
            </Button>
          </Group>
          <Stack gap={2} align="flex-end">
            <Group gap="xs">
              <Text className="monospace-label" size="xs" c="dimmed">
                post-game review
              </Text>
              <Badge color="red" variant="filled">澶嶇洏</Badge>
            </Group>
            <Text size="sm" fw={700}>{scriptTitle}</Text>
            {sessionId && (
              <Badge size="sm" variant="outline" color="gray">
                浼氳瘽 {sessionId.slice(0, 8)}鈥?
              </Badge>
            )}
          </Stack>
        </Group>

        {/* Tab 鍒囨崲 */}
        <Tabs value={reviewTab} onChange={setReviewTab}>
          <Tabs.List grow mb="xl">
            <Tabs.Tab value="table" leftSection={<IconUsers size={16} />}>
              鍦嗘璇勫垎鐪嬫澘
            </Tabs.Tab>
            <Tabs.Tab value="skills" leftSection={<IconDna size={16} />}>
              缁忛獙鎶€鑳介潰鏉?
            </Tabs.Tab>
          </Tabs.List>

          {/* ==================== Tab 1锛氬渾妗岃瘎鍒嗙湅鏉?==================== */}
          <Tabs.Panel value="table" pt="md">
            <Paper radius="xl" p="xl" className="industrial-card">
              <Stack gap="lg" align="center">
                {/* 鏍囬琛?*/}
                <Group justify="space-between" w="100%" wrap="wrap">
                  <Box>
                    <Text className="monospace-label" size="xs" c="dimmed">
                      dm score table
                    </Text>
                    <Title order={3}>DM 缁煎悎璇勫垎鍦嗘</Title>
                  </Box>
                  <Badge color="red" variant="light">
                    {gamePlayers.length} 涓鑹插腑浣?
                  </Badge>
                </Group>

                {/* 鍦嗘 鈥?1:1 澶嶅埢 game 閲岀殑 round-table */}
                <Box className="round-table" style={{ width: 420, height: 420 }}>
                  {/* 妗岄潰 */}
                  <Box className="round-table__surface" />

                  {/* DM 灞呬腑 */}
                  {dmPlayer && (
                    <Box
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 5,
                        textAlign: "center",
                      }}
                    >
                      <Tooltip label="DM 路 闆炬腐涓荤悊浜?>
                        <Avatar
                          src={dmPortrait}
                          size={64}
                          radius="xl"
                          imageProps={{ style: { objectPosition: "top" } }}
                          style={{
                            border: "3px solid rgba(250, 82, 82, 0.45)",
                            boxShadow: "0 0 24px rgba(250, 82, 82, 0.2)",
                          }}
                        />
                      </Tooltip>
                      <Text size="xs" c="dimmed" mt={2}>DM</Text>
                    </Box>
                  )}

                  {/* 瑙掕壊搴т綅 */}
                  {gamePlayers.map((player, index) => {
                    const review = getReview(player.id);
                    const score = review?.compositeScore ?? 0;
                    const isHighest = player.id === highestScoreId;
                    const position = getSeatPosition(index, gamePlayers.length);
                    const portrait = characterPortraits[player.role];

                    return (
                      <Box
                        key={player.id}
                        className="round-table__seat"
                        style={{ left: position.left, top: position.top }}
                        onClick={() => setSelectedPlayerId(player.id)}
                      >
                        {/* 璇勫垎鍏夌幆 */}
                        <RingProgress
                          size={84}
                          thickness={4}
                          roundCaps
                          sections={[{ value: score, color: getRingColor(score) }]}
                          label={
                            <Box style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {portrait ? (
                                <Avatar
                                  src={portrait}
                                  size={52}
                                  radius="xl"
                                  className="round-table__role"
                                  imageProps={{ style: { objectPosition: "top" } }}
                                />
                              ) : (
                                <Avatar size={52} radius="xl" color={player.color} className="round-table__role">
                                  {player.role.slice(0, 1)}
                                </Avatar>
                              )}
                            </Box>
                          }
                        />
                        {/* 瑙掕壊鍚?*/}
                        <Text size="xs" fw={700} ta="center" lh={1.1} mt={2}>
                          {player.role}
                        </Text>
                        {/* 缁煎悎璇勫垎 */}
                        <Badge
                          size="xs"
                          variant={isHighest ? "filled" : "light"}
                          color={isHighest ? "yellow" : getScoreColor(score)}
                          style={isHighest ? { boxShadow: "0 0 12px rgba(251, 191, 36, 0.5)" } : undefined}
                          mt={2}
                        >
                          {score}
                        </Badge>
                        {/* 鍚嶅瓧鏍囩 */}
                        <Text
                          size="xs"
                          ta="center"
                          c={player.id === "user" ? "orange.3" : "dimmed"}
                          fw={player.id === "user" ? 800 : 400}
                          mt={2}
                        >
                          {player.name}
                        </Text>
                        {player.id === "user" ? (
                          <Text size="xs" c="orange.3" fw={700} ta="center">
                            鐪熶汉鐜╁
                          </Text>
                        ) : player.agent ? (
                          <Text size="xs" c="dimmed" ta="center">
                            AI Agent
                          </Text>
                        ) : (
                          <Text size="xs" c="dimmed" ta="center">
                            鐜╁
                          </Text>
                        )}
                      </Box>
                    );
                  })}
                </Box>

                <Text size="sm" c="dimmed">
                  鐐瑰嚮瑙掕壊澶村儚鏌ョ湅 DM 璇︾粏璇勫垎缁村害 路 閲戣壊鍏夌幆涓烘渶楂樺垎
                </Text>
              </Stack>
            </Paper>
          </Tabs.Panel>

          {/* ==================== Tab 2锛氱粡楠屾妧鑳介潰鏉?==================== */}
          <Tabs.Panel value="skills" pt="md">
            <Paper radius="xl" className="industrial-card" p="xl">
              <Stack gap="lg">
                <Group justify="space-between">
                  <Box>
                    <Group gap="xs">
                      <IconDna size={18} color="#fbbf24" />
                      <Text className="monospace-label" size="xs" c="yellow.3">
                        experience skill dashboard
                      </Text>
                    </Group>
                    <Title order={3} mt={4}>缁忛獙鎶€鑳?路 缁忛獙鍙鍖?/Title>
                    <Text size="sm" c="dimmed" mt={4}>
                      姣忓眬缁撴潫鍚庯紝Agent 鐢熸垚鍘熷缁忛獙锛圗xperience锛夆啋 DM 璇勫鎵撳垎 鈫?楂樿川閲忕粡楠屾彁鐐间负鏅€傛妧鑳斤紝鍙湪鏂板眬涓鐢ㄣ€?
                    </Text>
                  </Box>
                  <Badge color="yellow" variant="light" size="lg">
                    {skills.length} 涓妧鑳?
                  </Badge>
                </Group>

                <Box className="agent-masonry">
                  {skillsLoading ? (
                    <Text c="dimmed" ta="center" py="xl">鍔犺浇鎶€鑳戒腑鈥?/Text>
                  ) : skillsError ? (
                    <Text c="red.4" ta="center" py="xl">鍔犺浇澶辫触锛歿skillsError}</Text>
                  ) : skills.length === 0 ? (
                    <Text c="dimmed" ta="center" py="xl">鏆傛棤鎶€鑳芥暟鎹?/Text>
                  ) : (
                    skills.map((skill) => (
                    <Box key={skill.id} className="agent-masonry__item">
                      <Card
                        radius="lg"
                        className="tone-panel"
                        p="md"
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedSkill(skill)}
                      >
                        <Stack gap="sm" h="100%">
                          <Group justify="space-between">
                            <Badge
                              size="sm"
                              variant="filled"
                              color={CATEGORY_COLORS[skill.category] || "gray"}
                              leftSection={CATEGORY_ICONS[skill.category]}
                            >
                              {skill.categoryLabel}
                            </Badge>
                            <Badge size="sm" variant="light" color={getScoreColor(skill.score * 100)}>
                              {skill.score.toFixed(2)}
                            </Badge>
                          </Group>

                          <Text fw={700} size="sm" lh={1.4}>
                            {skill.title}
                          </Text>

                          <Text size="xs" c="dimmed" lh={1.6} lineClamp={3} style={{ flex: 1 }}>
                            {skill.content}
                          </Text>

                          <Group gap={4}>
                            {skill.signals.slice(0, 3).map((tag) => (
                              <Badge key={tag} size="xs" variant="outline" color="gray">
                                {tag}
                              </Badge>
                            ))}
                          </Group>

                          <Group justify="space-between">
                            <Text size="xs" c="dimmed">
                              {skill.publisherName} 路 宸茬敤 {skill.usageCount} 娆?
                            </Text>
                            <IconEye size={14} style={{ opacity: 0.4 }} />
                          </Group>
                        </Stack>
                      </Card>
                    </Box>
                    ))
                  )}
                </Box>
              </Stack>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      {/* ==================== 寮圭獥锛氳瘎鍒嗙淮搴﹁鎯?==================== */}
      <Modal
        opened={!!selectedPlayerId}
        onClose={() => setSelectedPlayerId(null)}
        title={null}
        radius="xl"
        size="md"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        {selectedPlayer && selectedReview && (
          <Paper radius="xl" className="industrial-card" p="lg">
            <Stack gap="md">
              <Group align="flex-start" wrap="nowrap">
                {characterPortraits[selectedPlayer.role] ? (
                  <Avatar
                    src={characterPortraits[selectedPlayer.role]}
                    size={64}
                    radius="xl"
                    imageProps={{ style: { objectPosition: "top" } }}
                  />
                ) : (
                  <Avatar size={64} radius="xl" color={selectedPlayer.color}>
                    {selectedPlayer.role.slice(0, 1)}
                  </Avatar>
                )}
                <Box style={{ flex: 1 }}>
                  <Text className="monospace-label" size="xs" c="orange.3">
                    dm score detail
                  </Text>
                  <Title order={3}>{selectedPlayer.role} 路 {selectedPlayer.name}</Title>
                  <Group gap="xs" mt={4}>
                    <Badge size="sm" color={selectedPlayer.agent ? "blue" : "orange"} variant="light">
                      {selectedPlayer.id === "user" ? "鐪熶汉鐜╁" : selectedPlayer.agent ? "AI Agent" : "鐜╁"}
                    </Badge>
                    <Badge
                      size="sm"
                      color={getScoreColor(selectedReview.compositeScore)}
                      variant="filled"
                      leftSection={<IconStarFilled size={12} />}
                    >
                      缁煎悎 {selectedReview.compositeScore}
                    </Badge>
                  </Group>
                </Box>
              </Group>

              <Stack gap="sm">
                {SCORE_DIMENSIONS.map((dim) => {
                  const value = selectedReview.dimensions[dim.key] ?? 0;
                  return (
                    <Box key={dim.key}>
                      <Group justify="space-between" mb={4}>
                        <Group gap={6}>
                          {dim.icon}
                          <Text size="sm" fw={500}>{dim.label}</Text>
                        </Group>
                        <Text size="sm" fw={700} c={`${getScoreColor(value)}.3`}>
                          {value}
                        </Text>
                      </Group>
                      <Progress value={value} color={getScoreColor(value)} size="sm" radius="xl" />
                      <Text size="xs" c="dimmed" mt={2}>{dim.description}</Text>
                    </Box>
                  );
                })}
              </Stack>

              <Card radius="lg" className="ambient-grid" p="md">
                <Group gap="xs" mb="sm">
                  <IconMessageCircle size={16} />
                  <Text fw={700} size="sm">DM 璇勮</Text>
                </Group>
                <Text size="sm" c="dimmed" lh={1.7}>
                  {selectedReview.dmComment}
                </Text>
              </Card>
            </Stack>
          </Paper>
        )}
      </Modal>

      {/* ==================== 寮圭獥锛氭妧鑳借鎯?==================== */}
      <Modal
        opened={!!selectedSkill}
        onClose={() => setSelectedSkill(null)}
        title={null}
        radius="xl"
        size="md"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        {selectedSkill && (
          <Paper radius="xl" className="industrial-card" p="lg">
            <Stack gap="md">
              <Group justify="space-between">
                <Badge
                  variant="filled"
                  color={CATEGORY_COLORS[selectedSkill.category] || "gray"}
                  leftSection={CATEGORY_ICONS[selectedSkill.category]}
                >
                  {selectedSkill.categoryLabel}
                </Badge>
                <Badge variant="light" color={getScoreColor(selectedSkill.score * 100)}>
                  璇勫垎 {selectedSkill.score.toFixed(2)}
                </Badge>
              </Group>

              <Title order={3}>{selectedSkill.title}</Title>

              <Text size="sm" c="dimmed">
                鍙戝竷鑰咃細{selectedSkill.publisherName}锛坽selectedSkill.publisherRole === "dm" ? "DM" : "闄帺 Agent"}锛?
              </Text>

              <Card radius="lg" className="ambient-grid" p="md">
                <Text fw={700} size="sm" mb="sm">缁忛獙鍐呭</Text>
                <Text size="sm" c="dimmed" lh={1.7}>{selectedSkill.content}</Text>
              </Card>

              {selectedSkill.strategy && (
                <Card radius="lg" className="ambient-grid" p="md">
                  <Text fw={700} size="sm" mb="sm">绛栫暐鏂规硶</Text>
                  <Text size="sm" c="dimmed" lh={1.7} style={{ whiteSpace: "pre-wrap" }}>
                    {selectedSkill.strategy}
                  </Text>
                </Card>
              )}

              <Group gap={4}>
                {selectedSkill.signals.map((tag) => (
                  <Badge key={tag} size="xs" variant="light" color="gray">{tag}</Badge>
                ))}
              </Group>

              <Group justify="space-between">
                <Text size="xs" c="dimmed">鍒涘缓浜?{selectedSkill.createdAt}</Text>
                <Text size="xs" c="dimmed">宸蹭娇鐢?{selectedSkill.usageCount} 娆?/Text>
              </Group>
            </Stack>
          </Paper>
        )}
      </Modal>
    </Box>
  );
}

export default ReviewPage;
