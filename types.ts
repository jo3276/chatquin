export interface QuizData {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  quiz?: QuizData;
}

export type DataSourceType = 'image' | 'file' | 'text' | 'link';

// NEW: Font settings, managed separately from the theme for user customization.
export interface FontSettings {
    size: 'sm' | 'base' | 'lg';
    weight: 'normal' | 'bold';
}

// REDESIGNED: ThemeConfig for readability, comfort, and accessibility.
export interface ThemeConfig {
  name: string;
  isPreset: boolean;
  colors: {
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    accentPrimary: string;
    accentSecondary: string; // for hover/active states
    textPrimary: string;
    textSecondary: string;
    textOnAccent: string;
    border: string;
  };
  typography: {
    fontFamily: string;
  };
  // Optional override for accessibility presets
  fontSettingsOverride?: Partial<FontSettings>; 
}


export type ChatPersonality = 'professional' | 'friend' | 'lover' | 'logic' | 'genz';

export type ChatMode = 'chat' | 'quiz' | 'summary' | 'mindmap';

export interface SampleQuery {
    question: string;
}

export interface ExtractedUrlData {
    extractedText: string;
    summary: string;
    persona: string;
    sampleQueries: SampleQuery[];
}

export interface SavedChatbot {
    id: string;
    name: string;
    contextText: string;
    createdAt: string;
    knowledgeScope: 'strict' | 'general';
    sourceType?: DataSourceType;
    // Optional fields for URL-based chatbots
    summary?: string;
    persona?: string;
    sampleQueries?: SampleQuery[];
    history?: ChatMessage[];
}

export interface GeneralChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
  personality: ChatPersonality;
}
