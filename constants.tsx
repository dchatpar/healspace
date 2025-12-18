
import React from 'react';
import { 
  Smile, 
  Frown, 
  CloudRain, 
  Zap, 
  Sun, 
  Coffee,
  Heart,
  Shield,
  Phone,
  MessageCircle,
  Book,
  Anchor
} from 'lucide-react';
import { Mood, ListenerProfile } from './types';

export const TOPICS = [
  "Grief & Loss",
  "Family & Rishtey",
  "Career & Padhai Stress",
  "Loneliness (Akela-pan)",
  "Health & Wellness",
  "Burnout & Thakaan",
  "General Baat-cheet"
];

export const MOOD_CONFIG: Record<Mood, { label: string; icon: React.ReactNode; color: string }> = {
  [Mood.ANXIOUS]: { label: 'Anxious', icon: <Zap className="w-6 h-6" />, color: 'bg-amber-100 text-amber-700' },
  [Mood.LONELY]: { label: 'Lonely', icon: <CloudRain className="w-6 h-6" />, color: 'bg-blue-100 text-blue-700' },
  [Mood.GRIEVING]: { label: 'Grieving', icon: <Frown className="w-6 h-6" />, color: 'bg-indigo-100 text-indigo-700' },
  [Mood.STRESSED]: { label: 'Stressed', icon: <Coffee className="w-6 h-6" />, color: 'bg-rose-100 text-rose-700' },
  [Mood.OVERJOYED]: { label: 'Overjoyed', icon: <Sun className="w-6 h-6" />, color: 'bg-yellow-100 text-yellow-700' },
  [Mood.TIRED]: { label: 'Tired', icon: <Smile className="w-6 h-6" />, color: 'bg-slate-100 text-slate-700' },
};

export const SAMPLE_LISTENERS: ListenerProfile[] = [
  {
    id: 'l1',
    name: 'Aarav (Verified)',
    bio: 'Work-life balance aur career stress mein expert. Main yahan hoon taaki aap bina kisi tension ke apni baat rakh sakein.',
    tags: ['Career & Padhai Stress', 'Burnout & Thakaan', 'General Baat-cheet'],
    isOnline: true,
    rating: 4.9,
    callCount: 342,
    vibe: 'Calm & Grounded',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
  },
  {
    id: 'l2',
    name: 'Ishani',
    bio: 'Relationship issues ya family problems? Sab handle ho jayega. Let’s talk and find a way out together.',
    tags: ['Family & Rishtey', 'Grief & Loss', 'Healing'],
    isOnline: true,
    rating: 4.8,
    callCount: 156,
    vibe: 'Warm & Empathetic',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
  },
  {
    id: 'l3',
    name: 'Rohan',
    bio: 'Social anxiety aur akelapan feel ho raha hai? Main ek accha listener hoon, aap bas share karein.',
    tags: ['Loneliness (Akela-pan)', 'Anxiety', 'Mindfulness'],
    isOnline: true,
    rating: 4.9,
    callCount: 289,
    vibe: 'Analytical & Kind',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
  },
  {
    id: 'l4',
    name: 'Priya',
    bio: 'Mushkil waqt mein koi saath chahiye? Main yahan hoon. Emotional support ke liye kabhi bhi connect karein.',
    tags: ['Grief & Loss', 'Health & Wellness'],
    isOnline: false,
    rating: 5.0,
    callCount: 88,
    vibe: 'Steady & Present',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop'
  }
];
