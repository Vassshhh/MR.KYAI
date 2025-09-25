// src/app/layout/app-layout.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';
import { SidebarModule } from 'primeng/sidebar';
import { LayoutService } from './../core/services/layout.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    BottomNavComponent,
    SidebarModule
  ],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnInit {
  showHeader = false; // default hidden, karena header sudah dihapus
  hideBody = false;

  constructor(
    public layoutService: LayoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const initialUrl = this.router.url;
    this.updateLayoutFlags(initialUrl);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = (event as NavigationEnd).urlAfterRedirects;
        this.updateLayoutFlags(url);
      });
  }

  private updateLayoutFlags(url: string) {
    const isAiChat = url.startsWith('/ai-chat');
    this.showHeader = false;   // header dihilangkan permanen
    this.hideBody = isAiChat;
    console.log('URL:', url, '| hideBody:', this.hideBody, '| showHeader:', this.showHeader);
  }
}
