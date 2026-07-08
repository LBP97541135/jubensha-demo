import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge, Button, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconPlayerPlay, IconRefresh } from "@tabler/icons-react";
import { aiApi, scriptsApi, sessionsApi } from "../api";

function GameEntryPage() {
  const { scriptId } = useParams<{ scriptId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [script, setScript] = React.useState<Record<string, any> | null>(null);
  const [aiStatus, setAiStatus] = React.useState<Record<string, any> | null>(null);

  React.useEffect(() => {
    if (!scriptId) return;
    Promise.all([
      scriptsApi.get(scriptId).catch(() => null),
      aiApi.getStatus().catch(() => null),
    ]).then(([scriptData, aiData]) => {
      const resolvedScript = (scriptData as any)?.script || scriptData;
      if (resolvedScript) setScript(resolvedScript);
      if (aiData) setAiStatus(aiData);
    });
  }, [scriptId]);

  const handleCreateSession = async () => {
    if (!scriptId) return;
    setLoading(true);
    try {
      const result = await sessionsApi.create(scriptId, script?.title || "剧本游戏");
      window.localStorage.setItem(`game-session:${scriptId}`, result.id);
      navigate(`/game/${result.id}`);
    } catch (error) {
      console.error("创建会话失败:", error);
      alert("创建游戏会话失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleResumeSession = () => {
    const saved = scriptId ? window.localStorage.getItem(`game-session:${scriptId}`) : "";
    if (saved) {
      navigate(`/game/${saved}`);
    } else {
      void handleCreateSession();
    }
  };

  return (
    <Paper p="xl" className="flex flex-col items-center justify-center min-h-[80vh]">
      <Title order={1} className="mb-4">
        {script?.title || "准备游戏"}
      </Title>
      <Text c="dimmed" className="mb-8 text-center">
        {script?.description || "选择创建新游戏或恢复已有会话"}
      </Text>

      {aiStatus && !aiStatus.available && (
        <Badge color="orange" variant="outline" className="mb-6">
          无模型模式：AI 回复将使用本地 fallback
        </Badge>
      )}

      <Stack gap="md" className="w-full max-w-md">
        <Button
          size="lg"
          leftSection={<IconPlayerPlay />}
          onClick={handleCreateSession}
          loading={loading}
          className="w-full"
        >
          创建新游戏
        </Button>

        <Button
          size="lg"
          variant="outline"
          leftSection={<IconRefresh />}
          onClick={handleResumeSession}
          loading={loading}
          className="w-full"
        >
          恢复上次游戏
        </Button>
      </Stack>

      <Group mt="xl" gap="md">
        <Button variant="subtle" onClick={() => navigate("/library")}>
          返回剧本库
        </Button>
        {script && (
          <Button variant="subtle" onClick={() => navigate(`/scripts/${scriptId}`)}>
            查看剧本详情
          </Button>
        )}
      </Group>
    </Paper>
  );
}

export { GameEntryPage };
