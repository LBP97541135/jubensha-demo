import React from "react";
import { Anchor, Badge, Group, Paper, Text } from "@mantine/core";
import { IconAlertCircle, IconLinkOff, IconRobot } from "@tabler/icons-react";
import { aiApi, integrationsApi } from "../../../api";

interface AIStatus {
  service: string;
  model: string;
  available: boolean;
  fallback_mode: "LOCAL_ONLY" | "NO_LLM" | "OPENAI";
  api_key_configured: boolean;
}

interface IntegrationStatus {
  integration_mode: string;
  external_integrations_allowed: boolean;
}

function LocalModeBanner() {
  const [aiStatus, setAiStatus] = React.useState<AIStatus | null>(null);
  const [integrationStatus, setIntegrationStatus] = React.useState<IntegrationStatus | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    Promise.all([
      aiApi.getStatus().catch(() => null),
      integrationsApi.getStatus().catch(() => null),
    ]).then(([aiData, integrationData]) => {
      if (cancelled) return;
      if (aiData) setAiStatus(aiData);
      if (integrationData) setIntegrationStatus(integrationData);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const aiDisabled = aiStatus?.available === false;
  const externalDisabled = integrationStatus?.external_integrations_allowed === false;
  if (loading || (!aiDisabled && !externalDisabled)) return null;

  const messages = [
    aiDisabled
      ? aiStatus?.fallback_mode === "LOCAL_ONLY"
        ? "本地模式：AI 回复使用本地模板，部分功能会降级。"
        : "无模型模式：AI 功能不可用，流程将使用 fallback。"
      : "",
    externalDisabled ? "外部集成已关闭，仅使用本地数据。" : "",
  ].filter(Boolean);

  return (
    <Paper p="sm" className="bg-orange-500/20 border-orange-500/30">
      <Group justify="space-between" gap="sm" wrap="wrap">
        <Group gap="sm" wrap="wrap">
          <IconAlertCircle size="1rem" className="text-orange-400" />
          {aiDisabled && (
            <Badge variant="outline" color="orange" leftSection={<IconRobot size="0.75rem" />}>
              {aiStatus?.fallback_mode === "LOCAL_ONLY" ? "本地模式" : "无模型"}
            </Badge>
          )}
          {externalDisabled && (
            <Badge variant="outline" color="gray" leftSection={<IconLinkOff size="0.75rem" />}>
              外部集成关闭
            </Badge>
          )}
          <Text size="sm" className="text-orange-100">
            {messages.join(" ")}
          </Text>
        </Group>
        <Anchor href="/settings" size="sm" className="text-orange-100 hover:text-white">
          查看设置
        </Anchor>
      </Group>
    </Paper>
  );
}

export { LocalModeBanner };
