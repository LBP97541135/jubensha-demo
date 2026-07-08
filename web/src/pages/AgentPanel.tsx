import React from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconRefresh, IconSearch, IconUserStar } from "@tabler/icons-react";

import { listAgents, listPersonas } from "../api/agents";
import type { AgentInfo, AgentPersona } from "../api/legacy-types";
import { StudioShell } from "./StudioShell";

const roleLabels: Record<string, string> = {
  dm: "DM",
  companion: "Companion",
  assistant: "Assistant",
};

export function AgentPanel() {
  const [agents, setAgents] = React.useState<AgentInfo[]>([]);
  const [personas, setPersonas] = React.useState<AgentPersona[]>([]);
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [selectedPersona, setSelectedPersona] = React.useState<AgentPersona | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [personaItems, agentItems] = await Promise.all([
        listPersonas().catch(() => []),
        listAgents().catch(() => []),
      ]);
      setPersonas(personaItems);
      setAgents(agentItems);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const normalizedQuery = query.toLowerCase();
  const filteredPersonas = personas.filter((persona) => {
    const text = `${persona.name} ${persona.role} ${persona.tags?.join(" ") || ""}`.toLowerCase();
    return text.includes(normalizedQuery);
  });

  const filteredAgents = agents.filter((agent) => {
    const text = `${agent.name} ${agent.role} ${agent.model}`.toLowerCase();
    return text.includes(normalizedQuery);
  });

  return (
    <StudioShell
      eyebrow="Agent Center"
      title="Agents and Personas"
      subtitle="Browse local personas and registered companion agents."
      stats={[
        { label: "Personas", value: String(personas.length) },
        { label: "Agents", value: String(agents.length) },
      ]}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="flex-end" wrap="wrap">
          <Box>
            <Text size="sm" c="dimmed">
              Agent Center
            </Text>
            <Title order={1}>Agents and Personas</Title>
          </Box>
          <Button leftSection={<IconRefresh size={16} />} loading={loading} onClick={load}>
            Refresh
          </Button>
        </Group>

        <TextInput
          leftSection={<IconSearch size={16} />}
          placeholder="Search agents, personas, roles, or tags"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />

        {error ? (
          <Card withBorder p="md">
            <Text c="red" size="sm">
              {error}
            </Text>
          </Card>
        ) : null}

        <Stack>
          <Group gap="xs">
            <IconUserStar size={18} />
            <Title order={2}>Personas</Title>
            <Badge>{filteredPersonas.length}</Badge>
          </Group>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {filteredPersonas.map((persona) => (
              <Card
                key={persona.key}
                withBorder
                radius="md"
                p="md"
                component="button"
                onClick={() => setSelectedPersona(persona)}
              >
                <Stack gap="xs" align="flex-start">
                  <Avatar color="indigo" radius="xl">
                    {(persona.name || persona.key).slice(0, 1).toUpperCase()}
                  </Avatar>
                  <Text fw={700}>{persona.name || persona.key}</Text>
                  <Text size="sm" c="dimmed">
                    {roleLabels[persona.role] || persona.role}
                  </Text>
                  <Group gap={6}>
                    {(persona.tags || []).slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="light">
                        {tag}
                      </Badge>
                    ))}
                  </Group>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>

        <Stack>
          <Group gap="xs">
            <Title order={2}>Registered Agents</Title>
            <Badge>{filteredAgents.length}</Badge>
          </Group>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {filteredAgents.map((agent) => (
              <Card key={agent.key || agent.node_id} withBorder radius="md" p="md">
                <Stack gap="xs">
                  <Text fw={700}>{agent.name || agent.key}</Text>
                  <Text size="sm" c="dimmed">
                    {roleLabels[agent.role] || agent.role}
                  </Text>
                  <Text size="xs">Model: {agent.model || "local"}</Text>
                  <Badge color={agent.registered ? "green" : "gray"}>
                    {agent.registered ? "Registered" : "Local"}
                  </Badge>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      </Stack>

      <Modal
        opened={Boolean(selectedPersona)}
        onClose={() => setSelectedPersona(null)}
        title={selectedPersona?.name || "Persona details"}
      >
        {selectedPersona ? (
          <Stack>
            <Text size="sm" c="dimmed">
              {roleLabels[selectedPersona.role] || selectedPersona.role}
            </Text>
            <Text>{selectedPersona.background || selectedPersona.vibe || "No background yet."}</Text>
            <Group gap="xs">
              {(selectedPersona.skills || []).map((skill) => (
                <Badge key={skill} variant="light">
                  {skill}
                </Badge>
              ))}
            </Group>
          </Stack>
        ) : null}
      </Modal>
    </StudioShell>
  );
}

export default AgentPanel;
