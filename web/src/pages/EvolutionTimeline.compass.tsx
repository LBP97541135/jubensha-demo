import React from "react";
import { Badge, Button, Card, Group, SimpleGrid, Stack, Text, Textarea, Timeline, Title } from "@mantine/core";
import { IconMessageCircle, IconSparkles, IconTimeline } from "@tabler/icons-react";

import { StudioShell } from "./StudioShell";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function EvolutionTimeline() {
  const [input, setInput] = React.useState("");
  const [chatHistory, setChatHistory] = React.useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "I can help capture player preferences, recommend scripts, and summarize recent sessions.",
    },
  ]);

  const send = () => {
    const text = input.trim();
    if (!text) return;

    setChatHistory((prev) => [
      ...prev,
      { role: "user", content: text },
      {
        role: "assistant",
        content: "Saved locally. Recommendation and review services can use this context later.",
      },
    ]);
    setInput("");
  };

  return (
    <StudioShell
      eyebrow="Assistant Hub"
      title="Personal Assistant"
      subtitle="Capture preferences, keep lightweight notes, and prepare future recommendations."
      stats={[
        { label: "Mode", value: "Local" },
        { label: "Messages", value: String(chatHistory.length) },
      ]}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="flex-end" wrap="wrap">
          <div>
            <Text size="sm" c="dimmed">
              Assistant Hub
            </Text>
            <Title order={1}>Personal Assistant</Title>
          </div>
          <Badge leftSection={<IconSparkles size={14} />} variant="light">
            Local First
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
          <Card withBorder radius="md" p="md">
            <Stack>
              <Group gap="xs">
                <IconMessageCircle size={18} />
                <Title order={2}>Assistant Chat</Title>
              </Group>
              <Stack gap="xs">
                {chatHistory.map((message, index) => (
                  <Card key={`${message.role}-${index}`} withBorder radius="sm" p="sm">
                    <Text size="xs" c="dimmed">
                      {message.role === "user" ? "You" : "Assistant"}
                    </Text>
                    <Text size="sm">{message.content}</Text>
                  </Card>
                ))}
              </Stack>
              <Textarea
                placeholder="Add a note or ask a question"
                value={input}
                onChange={(event) => setInput(event.currentTarget.value)}
                minRows={3}
              />
              <Button onClick={send}>Send</Button>
            </Stack>
          </Card>

          <Card withBorder radius="md" p="md">
            <Stack>
              <Group gap="xs">
                <IconTimeline size={18} />
                <Title order={2}>Experience Timeline</Title>
              </Group>
              <Timeline active={1} bulletSize={22} lineWidth={2}>
                <Timeline.Item title="Player profile">
                  <Text size="sm" c="dimmed">
                    Track preferred themes, pacing, and character styles.
                  </Text>
                </Timeline.Item>
                <Timeline.Item title="Script recommendation">
                  <Text size="sm" c="dimmed">
                    Recommend the next session from player history and current preferences.
                  </Text>
                </Timeline.Item>
                <Timeline.Item title="Review to skill">
                  <Text size="sm" c="dimmed">
                    Convert useful review patterns into reusable skills for future games.
                  </Text>
                </Timeline.Item>
              </Timeline>
            </Stack>
          </Card>
        </SimpleGrid>
      </Stack>
    </StudioShell>
  );
}

export default EvolutionTimeline;
