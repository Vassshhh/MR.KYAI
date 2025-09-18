import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutService } from '../../../core/services/layout.service';
import { EventBusService } from '../../../core/services/event-bus.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent {
  settingsMenuOpen: boolean = false; // <-- tambahkan

  constructor(
    public layoutService: LayoutService,
    private eventBus: EventBusService
  ) {}

  toggleSettingsMenu() {
    this.settingsMenuOpen = !this.settingsMenuOpen;
  }

  clearChatHistory() {
    if (confirm('Apakah Anda yakin ingin menghapus semua riwayat chat?')) {
      this.eventBus.emit('clearChatHistory');
      localStorage.removeItem('chatHistory');
      alert('Riwayat chat berhasil dihapus');
    }
  }
}
