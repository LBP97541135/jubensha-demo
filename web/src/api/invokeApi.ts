import { API_URL } from "../constants";
import type { Actor, LLMMessage, SafeActor } from "../types";

export interface InvocationRequest {
  globalStory: string;
  actor: Actor;
  sessionId: string;
  detectiveName: string;
  victimName: string;
  allActors: SafeActor[];
  chatMessages: LLMMessage[];
  temperature: number;
}

export interface InvocationResponse {
  original: string;
  critique: string;
  refined: string;
  finalResponse: string;
}

function actorPayload(actor: Actor | SafeActor) {
  return {
    id: actor.id,
    name: actor.name,
    bio: actor.bio,
    personality: actor.personality,
    context: actor.context,
    ...("secret" in actor ? { secret: actor.secret, violation: actor.violation } : {}),
    image: actor.image,
    is_victim: actor.isVictim,
    is_killer: actor.isKiller,
    is_assistant: actor.isAssistant,
    is_player: actor.isPlayer,
    is_partner: actor.isPartner,
    role_type: actor.roleType,
  };
}

function invocationPayload(req: InvocationRequest) {
  return {
    global_story: req.globalStory,
    actor: actorPayload(req.actor),
    session_id: req.sessionId,
    detective_name: req.detectiveName,
    victim_name: req.victimName,
    all_actors: req.allActors.map(actorPayload),
    chat_messages: req.chatMessages,
    temperature: req.temperature,
  };
}

export async function invokeAI(req: InvocationRequest): Promise<InvocationResponse> {
  const response = await fetch(`${API_URL}/invoke/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(invocationPayload(req)),
  });
  const result = await response.json();
  return {
    original: result.original || "",
    critique: result.critique || "",
    refined: result.refined || "",
    finalResponse: result.final_response || "",
  };
}

export async function invokeAIStream(
  req: InvocationRequest,
  onChunk: (text: string) => void,
  onDone: (final: string) => void,
  onError?: (error: Error) => void,
) {
  try {
    const response = await fetch(`${API_URL}/invoke/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
      body: JSON.stringify(invocationPayload(req)),
    });
    if (!response.ok || !response.body) {
      throw new Error(`Streaming request failed: ${response.status}`);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let final = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() || "";
      for (const event of events) {
        const line = event.split("\n").find((item) => item.startsWith("data:"));
        if (!line) continue;
        const data = JSON.parse(line.slice(5).trim());
        if (data.type === "token") {
          final += data.content || "";
          onChunk(data.content || "");
        } else if (data.type === "done") {
          final = data.final || final;
        } else if (data.type === "error") {
          throw new Error(data.message || "Streaming request failed");
        }
      }
    }
    onDone(final);
  } catch (error) {
    try {
      const fallback = await invokeAI(req);
      const final =
        fallback.finalResponse ||
        fallback.refined ||
        fallback.original ||
        "本地模式已接管发言：当前流式接口不可用，我会基于公开信息继续推进。";
      onChunk(final);
      onDone(final);
      return;
    } catch {
      const localFinal = `本地模式发言：${req.actor.name || "角色"}会基于当前公开线索继续讨论，不依赖外部模型。`;
      onChunk(localFinal);
      onDone(localFinal);
    }
  }
}
