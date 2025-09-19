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
            { 
                path: 'profile', 
                loadComponent: () => import('./features/profile/profile.component').then(c => c.ProfileComponent)
            },
            
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    }
];