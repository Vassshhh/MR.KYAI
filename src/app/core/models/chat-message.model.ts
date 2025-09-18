export interface ChatMessage {
  id?: string | number;   // ✅ tambahan
  role: 'user' | 'ai';
  text: string;
  isLoading?: boolean;
}
