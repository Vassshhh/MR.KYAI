import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { EventBusService } from '../../../core/services/event-bus.service';
// Pastikan import ini benar
import { TooltipModule } from 'primeng/tooltip'; 

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterModule,
    // Pastikan TooltipModule ada di sini
    TooltipModule 
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  settingsMenuOpen: boolean = false;
  
  // Pastikan properti ini ada
  public isExpanded: boolean = false;

  constructor(private eventBus: EventBusService) {}

  toggleSettingsMenu() {
    this.settingsMenuOpen = !this.settingsMenuOpen;
  }

  isSettingsActive(): boolean {
    return this.settingsMenuOpen;
  }

  clearChatHistory() {
    if (confirm('Apakah Anda yakin ingin menghapus semua riwayat chat?')) {
      this.eventBus.emit('clearChatHistory');
      localStorage.removeItem('chatHistory');
    }
  }
}