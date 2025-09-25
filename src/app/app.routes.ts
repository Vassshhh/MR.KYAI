// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout.component';

import { AiChatComponent } from './features/ai-chat/ai-chat.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      
      { path: 'ai-chat', component: AiChatComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
