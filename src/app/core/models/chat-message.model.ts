export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  isLoading?: boolean;
}
