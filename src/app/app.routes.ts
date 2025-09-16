// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AiChatComponent } from './features/ai-chat/ai-chat.component';

export const routes: Routes = [
    {
        path: '',
        component: AppLayoutComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'ai-chat', component: AiChatComponent },
            // Tambahkan rute untuk profile dan settings di sini
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    }
];
