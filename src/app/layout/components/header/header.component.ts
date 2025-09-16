import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '../../../core/services/layout.service'; // <-- PERBAIKAN: Import LayoutService
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  pageTitle$: Observable<string>; // <-- PERBAIKAN: Deklarasikan property

  // PERBAIKAN: Inject LayoutService
  constructor(public layoutService: LayoutService) {
    this.pageTitle$ = this.layoutService.pageTitle$; // <-- Inisialisasi
  }
}