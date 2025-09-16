import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type SidebarState = 'open' | 'hidden';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  // State untuk sidebar desktop (belum diimplementasikan di HTML)
  private sidebarState = new BehaviorSubject<SidebarState>('open');
  sidebarState$ = this.sidebarState.asObservable();

  // State untuk sidebar mobile (offcanvas)
  private mobileSidebarVisible = new BehaviorSubject<boolean>(false);
  mobileSidebarVisible$ = this.mobileSidebarVisible.asObservable();

  // State untuk judul halaman
  private pageTitle = new BehaviorSubject<string>('Agent Performance');
  pageTitle$ = this.pageTitle.asObservable();

  constructor() { }

  toggleMobileSidebar(): void {
    this.mobileSidebarVisible.next(!this.mobileSidebarVisible.getValue());
  }

  setPageTitle(title: string): void {
    this.pageTitle.next(title);
  }
}