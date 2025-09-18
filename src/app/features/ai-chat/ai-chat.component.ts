import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

// PrimeNG modules
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';

import { ChatService } from '../../core/services/chat.service';
import { ChatMessage } from '../../core/models/chat-message.model';
import { MarkedPipe } from '../../core/marked.pipe';
import { EventBusService } from './../../core/services/event-bus.service';


@Component({
  selector: 'app-ai-chat',
  standalone: true,
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    SidebarModule,
    MarkedPipe 
  ]
})
export class AiChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('chatMessagesContainer') private chatContainer!: ElementRef;

  sidebarVisible: boolean = false;
  newMessage: string = '';
  messages$: Observable<ChatMessage[]>;
  isLoading: boolean = false;

  private shouldScrollToBottom = true;
  private lastMessageCount = 0;
  private eventSubscription?: Subscription;

  constructor(
    private chatService: ChatService,
    private eventBus: EventBusService
  ) {
    this.messages$ = this.chatService.messages$;
  }

  ngOnInit(): void {
    this.messages$.subscribe(messages => {
      if (messages.length > this.lastMessageCount) {
        this.shouldScrollToBottom = true;
        this.lastMessageCount = messages.length;
      }
    });

    // Listen untuk event clearChatHistory dari sidebar - PERBAIKAN DI SINI
    this.eventSubscription = this.eventBus.on('clearChatHistory').subscribe(() => {
      console.log('Received clearChatHistory event from sidebar');
      
      // Reset local state
      this.shouldScrollToBottom = true;
      this.lastMessageCount = 0;
      
      // Panggil clearChatHistory dari service untuk update observable
      this.chatService.clearChatHistory();
    });
  }

  ngOnDestroy(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  async sendMessage() {
    if (!this.newMessage.trim() || this.isLoading) return;
    const messageToSend = this.newMessage.trim();
    this.newMessage = '';
    this.isLoading = true;
    this.shouldScrollToBottom = true;

    try {
      await this.chatService.sendMessageToBot(messageToSend);
      this.shouldScrollToBottom = true;
    } catch (error: any) {
      console.error('Error sending message:', error);
    } finally {
      this.isLoading = false;
    }
  }

  clearHistory() {
    if (confirm('Apakah Anda yakin ingin menghapus semua riwayat chat?')) {
      this.chatService.clearChatHistory();
      this.sidebarVisible = false;
      this.shouldScrollToBottom = true;
      this.lastMessageCount = 0;
    }
  }

  sendQuickMessage(message: string) {
    this.newMessage = message;
    this.shouldScrollToBottom = true;
    this.sendMessage();
  }

  startVoiceInput() {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Browser tidak mendukung voice recognition');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.newMessage = transcript;
    };

    recognition.onerror = (event: any) => {
      console.error('Voice recognition error:', event.error);
    };

    recognition.start();
  }

  trackByMessage(index: number, msg: ChatMessage): any {
    return msg?.id ?? index;
  }

  private scrollToBottom(): void {
    try {
      if (this.chatContainer) {
        setTimeout(() => {
          const element = this.chatContainer.nativeElement;
          element.scrollTop = element.scrollHeight;
        }, 50);
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}