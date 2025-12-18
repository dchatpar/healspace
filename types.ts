
export enum UserRole {
  SEEKER = 'SEEKER',
  LISTENER = 'LISTENER'
}

export enum Mood {
  ANXIOUS = 'ANXIOUS',
  LONELY = 'LONELY',
  GRIEVING = 'GRIEVING',
  STRESSED = 'STRESSED',
  OVERJOYED = 'OVERJOYED',
  TIRED = 'TIRED'
}

export interface ListenerProfile {
  id: string;
  name: string;
  bio: string;
  tags: string[];
  isOnline: boolean;
  rating: number;
  callCount: number;
  vibe: string;
  avatar: string;
}

export interface JournalEntry {
  id: string;
  content: string;
  timestamp: number;
  mood: Mood;
}

export interface Session {
  id: string;
  startTime: number;
  duration?: number;
  listenerId: string;
  seekerId: string;
  status: 'active' | 'completed' | 'reported';
}
