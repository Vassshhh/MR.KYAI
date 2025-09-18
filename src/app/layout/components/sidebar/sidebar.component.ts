import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { EventBusService } from '../../../core/services/event-bus.service';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  settingsMenuOpen: boolean = false;

  constructor(private eventBus: EventBusService) {}

  toggleSettingsMenu() {
    this.settingsMenuOpen = !this.settingsMenuOpen;
  }

  isSettingsActive(): boolean {
    return this.settingsMenuOpen;
  }

  clearChatHistory() {
    if (confirm('Apakah Anda yakin ingin menghapus semua riwayat chat?')) {
      // Emit event dengan format yang benar
      this.eventBus.emit('clearChatHistory');
      
      // Hapus dari localStorage juga
      localStorage.removeItem('chatHistory');
      
      alert('Riwayat chat berhasil dihapus');
    }
  }
}