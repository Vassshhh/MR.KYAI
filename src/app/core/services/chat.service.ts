// src/app/core/services/chat.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../models/chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'https://bot.kediritechnopark.com/webhook/mrkyai/chatbot';
  private CHAT_HISTORY_KEY = 'chatHistory';

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$: Observable<ChatMessage[]> = this.messagesSubject.asObservable();

  constructor() {
    this.loadChatHistory();
  }

  private loadChatHistory(): void {
    const history = JSON.parse(localStorage.getItem(this.CHAT_HISTORY_KEY) || '[]');
    if (history.length === 0) {
      history.push({ 
        text: 'Halo! Nama saya Dinda, senior customer service BAPENDA Jawa Timur. Ada yang bisa saya bantu hari ini?', 
        role: 'ai' 
      });
    }https://bot.kediritechnopark.com/webhook/mrkyai/chatbo
    this.messagesSubject.next(history);
  }

  private saveHistory(messages: ChatMessage[]): void {
    localStorage.setItem(this.CHAT_HISTORY_KEY, JSON.stringify(messages));
  }
  
  public addMessage(message: ChatMessage): void {
    const currentMessages = this.messagesSubject.getValue();
    const updatedMessages = [...currentMessages, message];
    this.messagesSubject.next(updatedMessages);
    this.saveHistory(updatedMessages);
  }

  // Method untuk update message tertentu (untuk mengganti loading message)
  private updateMessage(index: number, newMessage: ChatMessage): void {
    const currentMessages = this.messagesSubject.getValue();
    const updatedMessages = [...currentMessages];
    updatedMessages[index] = newMessage;
    this.messagesSubject.next(updatedMessages);
    this.saveHistory(updatedMessages);
  }

  public async sendMessageToBot(userMessage: string): Promise<string> {
    console.log('ChatService: Starting sendMessageToBot with:', userMessage);
    
    // 1. Tambahkan user message
    this.addMessage({ text: userMessage, role: 'user' });
    
    // 2. Tambahkan loading message dan simpan indexnya
    const currentMessages = this.messagesSubject.getValue();
    const loadingMessageIndex = currentMessages.length;
    this.addMessage({ text: '...', role: 'ai', isLoading: true });

    // 3. Setup session ID
    let sessionId = localStorage.getItem('tokenChat');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('tokenChat', sessionId);
    }

    try {
      console.log('ChatService: Making API request...');
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationId: sessionId,
          useTools: true,
          topK: 5
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('ChatService: Raw API response:', data);
      
      // 4. Extract dan validate response
let botReply: string = '';

if (data.output) {
  try {
    const parsed = JSON.parse(data.output); // parse string jadi object
    if (parsed.jawaban) {
      botReply = parsed.jawaban;
    } else {
      botReply = JSON.stringify(parsed); // fallback
    }
  } catch (e) {
    console.warn('ChatService: Failed to parse output JSON:', e);
    botReply = String(data.output);
  }
} else if (data.content) {
  if (typeof data.content === 'string') {
    botReply = data.content;
  } else if (typeof data.content === 'object') {
    botReply = JSON.stringify(data.content);
  } else {
    botReply = String(data.content);
  }
} else if (data.message) {
  botReply = String(data.message);
} else if (data.response) {
  botReply = String(data.response);
} else {
  botReply = 'Maaf, saya tidak dapat memberikan jawaban saat ini.';
}

      console.log('ChatService: Final botReply:', botReply);
      console.log('ChatService: botReply type:', typeof botReply);
      console.log('ChatService: botReply length:', botReply.length);

      // 6. Update loading message dengan response
      this.updateMessage(loadingMessageIndex, { 
        text: botReply, 
        role: 'ai',
        isLoading: false 
      });

      return botReply;

    } catch (error) {
      console.error('ChatService: Error in sendMessageToBot:', error);
      
      // Update loading message dengan error message
      const errorMessage = 'Maaf, terjadi kesalahan. Coba lagi nanti.';
      this.updateMessage(loadingMessageIndex, { 
        text: errorMessage, 
        role: 'ai',
        isLoading: false 
      });
      
      return errorMessage;
    }
  }

  public clearChatHistory(): void {
    localStorage.removeItem(this.CHAT_HISTORY_KEY);
    localStorage.removeItem('tokenChat');
    this.messagesSubject.next([]);
    this.loadChatHistory();
  }
}