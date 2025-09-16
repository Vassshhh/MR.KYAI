import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';
import { SidebarModule } from 'primeng/sidebar'; // <-- PERBAIKAN: Import SidebarModule
import { LayoutService } from './../core/services/layout.service'; // <-- PERBAIKAN: Import LayoutService

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    BottomNavComponent,
    SidebarModule // <-- PERBAIKAN: Tambahkan ke imports
  ],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent {
  // PERBAIKAN: Inject LayoutService
  constructor(public layoutService: LayoutService) {}
}