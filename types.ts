
export type NarrativeType = 'event' | 'link' | 'volunteer' | 'general';

export interface Narrative {
  title: string;
  content: string;
}

export interface GeneratedOutput {
  analysis: string;
  narratives: Narrative[];
  dataNeeded: string[];
}

export interface ChatPart {
    text: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    parts: ChatPart[];
}
