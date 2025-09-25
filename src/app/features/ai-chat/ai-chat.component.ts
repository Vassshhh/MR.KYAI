// src/app/features/ai-chat/ai-chat.component.ts

import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

// PrimeNG modules & Pipes
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MarkedPipe } from '../../core/marked.pipe';

// Services
import { ChatService } from '../../core/services/chat.service';
import { ChatMessage } from '../../core/models/chat-message.model';
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
    TooltipModule, // Tambahkan TooltipModule untuk pTooltip
    MarkedPipe 
  ]
})
export class AiChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('chatMessagesContainer') private chatContainer!: ElementRef;

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
    // Berlangganan ke stream pesan untuk memicu auto-scroll
    this.messages$.subscribe(messages => {
      if (messages.length > this.lastMessageCount) {
        this.shouldScrollToBottom = true;
        this.lastMessageCount = messages.length;
      }
    });

    // Mendengarkan event 'clearChatHistory' dari komponen lain (misal: sidebar)
    this.eventSubscription = this.eventBus.on('clearChatHistory').subscribe(() => {
      this.chatService.clearChatHistory();
      this.shouldScrollToBottom = true;
      this.lastMessageCount = 0;
    });
  }

  ngOnDestroy(): void {
    // Pastikan untuk unsubscribe untuk menghindari memory leak
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }

  ngAfterViewChecked() {
    // Lakukan scroll ke bawah jika ada pesan baru
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
    } catch (error: any) {
      console.error('Error saat mengirim pesan:', error);
      // Anda bisa menambahkan pesan error ke chat di sini jika perlu
    } finally {
      this.isLoading = false;
      this.shouldScrollToBottom = true;
    }
  }

  startVoiceInput() {
    // Fungsi speech recognition tetap sama
    if (!('webkitSpeechRecognition' in window)) {
      alert('Browser tidak mendukung voice recognition');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      this.newMessage = event.results[0][0].transcript;
    };

    recognition.onerror = (event: any) => {
      console.error('Voice recognition error:', event.error);
    };

    recognition.start();
  }
  
  // Fungsi trackBy untuk optimisasi ngFor
  trackByMessage(index: number, msg: ChatMessage): any {
    return msg?.id ?? index;
  }

  private scrollToBottom(): void {
    try {
      if (this.chatContainer) {
        // Gunakan timeout kecil untuk memastikan DOM sudah dirender sepenuhnya
        setTimeout(() => {
          const element = this.chatContainer.nativeElement;
          element.scrollTop = element.scrollHeight;
        }, 50);
      }
    } catch (err) {
      console.error('Gagal melakukan scroll:', err);
    }
  }
}