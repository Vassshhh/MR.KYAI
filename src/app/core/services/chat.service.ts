// src/app/core/services/chat.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../models/chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private n8nWebhookUrl = 'https://auto.lab.kediritechnopark.com/webhook/webchat/bapenda-kediri';
  private CHAT_HISTORY_KEY = 'chatHistory';

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$: Observable<ChatMessage[]> = this.messagesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadChatHistory();
  }

  private loadChatHistory(): void {
    const history = JSON.parse(localStorage.getItem(this.CHAT_HISTORY_KEY) || '[]');
    if (history.length === 0) {
      history.push({ 
        text: 'Hai, saya Maya, Virtual Agent Kediri Technopark. Ada yang bisa saya bantu?', 
        role: 'ai' 
      });
    }
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

  public sendMessageToBot(userMessage: string): void {
    this.addMessage({ text: userMessage, role: 'user' });
    this.addMessage({ text: '', role: 'ai', isLoading: true });
    
    let sessionId = localStorage.getItem('tokenChat');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('tokenChat', sessionId);
    }

    this.http.post<{ output: string }>(this.n8nWebhookUrl, { message: userMessage, sessionId })
      .subscribe({
        next: (response) => {
          const currentMessages = this.messagesSubject.getValue().filter(m => !m.isLoading);
          this.messagesSubject.next(currentMessages);
          this.addMessage({ text: response.output, role: 'ai' });
        },
        error: (err) => {
          const currentMessages = this.messagesSubject.getValue().filter(m => !m.isLoading);
          this.messagesSubject.next(currentMessages);
          this.addMessage({ text: 'Maaf, terjadi kesalahan. Coba lagi nanti.', role: 'ai' });
          console.error(err);
        }
      });
  }

  public clearChatHistory(): void {
    localStorage.removeItem(this.CHAT_HISTORY_KEY);
    localStorage.removeItem('tokenChat');
    this.messagesSubject.next([]);
    this.loadChatHistory();
  }
}
