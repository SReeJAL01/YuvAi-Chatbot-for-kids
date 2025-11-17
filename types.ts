export type MessageRole = 'user' | 'model';

export interface ChatMessage {
  role: MessageRole;
  text: string;
  image?: string | null; // Base64 data URL for images
}

export type Theme = 'light' | 'dark';

export interface UserSettings {
  isLoggedIn: boolean;
  userName: string;
  userAge: number;
  userAvatar: string | null; // Base64 data URL
  botAvatar: string;
  theme: Theme;
  accentColor: string; // hex code
}