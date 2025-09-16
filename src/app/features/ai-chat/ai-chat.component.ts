// src/app/features/ai-chat/ai-chat.component.ts

import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { ChatService } from '../../core/services/chat.service';
import { ChatMessage } from '../../core/models/chat-message.model';

// PERBAIKAN: Import pipe yang baru dibuat
import { MarkedPipe } from '../../core/marked.pipe';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    SidebarModule,
    MarkedPipe // PERBAIKAN: Tambahkan pipe ke array imports
  ],
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.scss']
})
export class AiChatComponent implements OnInit, AfterViewChecked {
  // ... (sisa kode komponen tidak perlu diubah) ...
  @ViewChild('chatMessagesContainer') private chatContainer!: ElementRef;
  messages$: Observable<ChatMessage[]>;
  newMessage: string = '';
  sidebarVisible: boolean = false;
  constructor(private chatService: ChatService) {
    this.messages$ = this.chatService.messages$;
  }
  ngOnInit(): void {}
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.chatService.sendMessageToBot(this.newMessage);
      this.newMessage = '';
    }
  }
  clearHistory(): void {
    this.chatService.clearChatHistory();
    this.sidebarVisible = false;
  }
  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}
