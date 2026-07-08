export interface BackendScript {
  id: string;
  title: string;
  description?: string;
  author?: string;
  version?: string;
  genre?: string;
  theme?: string;
  difficulty?: string;
  player_count?: number;
  duration_minutes?: number;
  cover_image?: string;
  emotion_level?: number;
  inference_level?: number;
  horror_level?: number;
  status?: string;
  created_at?: string;
  characters?: Array<{ id?: string; name?: string; role?: string }>;
  [key: string]: any;
}

export interface AgentInfo {
  id?: string;
  key?: string;
  name: string;
  role: "dm" | "companion" | "assistant";
  node_id?: string;
  registered?: boolean;
  model: string;
  persona_id?: string;
  persona_key?: string;
}

export interface AgentPersona {
  id: string;
  key: string;
  name: string;
  role: "dm" | "companion" | "assistant";
  vibe: string;
  voice: string;
  background: string;
  skills: string[];
  tags: string[];
  enabled: boolean;
}

export interface EvidenceRecord {
  id: string;
  name: string;
  basicDescription: string;
  detailedDescription: string;
  deepDescription: string;
  image_url: string;
  found: boolean;
  owner_id: string;
  session_id: string;
  is_public: boolean;
  category?: string;
  importance?: string;
}
