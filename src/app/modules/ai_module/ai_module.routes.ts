import { Routes } from '@angular/router';

import { aiModuleGuard } from './ai-module.guard';

export const aiModuleRoutes: Routes = [
    {
        path: 'ai_module/chat/index',
        loadComponent: () => import('./pages/aichat/ai-chat-index/ai-chat-index.component').then(m => m.AiChatIndexComponent),
        canActivate: [aiModuleGuard]
    },
    {
        // A conversation has to survive leaving the page, so it has its own
        // address. Same component - it just opens that one instead of the
        // agent picker.
        path: 'ai_module/chat/index/:id',
        loadComponent: () => import('./pages/aichat/ai-chat-index/ai-chat-index.component').then(m => m.AiChatIndexComponent),
        canActivate: [aiModuleGuard]
    },
    {
        path: 'ai_module/toolconfirmations/index',
        loadComponent: () => import('./pages/aichat/ai-confirmations-index/ai-confirmations-index.component').then(m => m.AiConfirmationsIndexComponent),
        canActivate: [aiModuleGuard]
    },
    {
        path: 'ai_module/agents/index',
        loadComponent: () => import('./pages/aiagents/ai-agents-index/ai-agents-index.component').then(m => m.AiAgentsIndexComponent),
        canActivate: [aiModuleGuard]
    },
    {
        path: 'ai_module/agents/add',
        loadComponent: () => import('./pages/aiagents/ai-agents-add/ai-agents-add.component').then(m => m.AiAgentsAddComponent),
        canActivate: [aiModuleGuard]
    },
    {
        path: 'ai_module/agents/edit/:id',
        loadComponent: () => import('./pages/aiagents/ai-agents-edit/ai-agents-edit.component').then(m => m.AiAgentsEditComponent),
        canActivate: [aiModuleGuard]
    },
    {
        path: 'ai_module/llmproviders/index',
        loadComponent: () => import('./pages/aillmproviders/ai-llm-providers-index/ai-llm-providers-index.component').then(m => m.AiLlmProvidersIndexComponent),
        canActivate: [aiModuleGuard]
    },
    {
        path: 'ai_module/llmproviders/add',
        loadComponent: () => import('./pages/aillmproviders/ai-llm-providers-add/ai-llm-providers-add.component').then(m => m.AiLlmProvidersAddComponent),
        canActivate: [aiModuleGuard]
    },
    {
        path: 'ai_module/llmproviders/edit/:id',
        loadComponent: () => import('./pages/aillmproviders/ai-llm-providers-edit/ai-llm-providers-edit.component').then(m => m.AiLlmProvidersEditComponent),
        canActivate: [aiModuleGuard]
    },
    {
        path: 'ai_module/mcpservers/index',
        loadComponent: () => import('./pages/aimcpservers/ai-mcp-servers-index/ai-mcp-servers-index.component').then(m => m.AiMcpServersIndexComponent),
        canActivate: [aiModuleGuard]
    },
    {
        path: 'ai_module/mcpservers/add',
        loadComponent: () => import('./pages/aimcpservers/ai-mcp-servers-add/ai-mcp-servers-add.component').then(m => m.AiMcpServersAddComponent),
        canActivate: [aiModuleGuard]
    },
    {
        path: 'ai_module/mcpservers/edit/:id',
        loadComponent: () => import('./pages/aimcpservers/ai-mcp-servers-edit/ai-mcp-servers-edit.component').then(m => m.AiMcpServersEditComponent),
        canActivate: [aiModuleGuard]
    },
    {
        path: 'ai_module/mcpservers/tools/:id',
        loadComponent: () => import('./pages/aimcpservers/ai-mcp-servers-tools/ai-mcp-servers-tools.component').then(m => m.AiMcpServersToolsComponent),
        canActivate: [aiModuleGuard]
    },
    {
        path: 'ai_module/chatsessions/index',
        loadComponent: () => import('./pages/aichatsessions/ai-chat-sessions-index/ai-chat-sessions-index.component').then(m => m.AiChatSessionsIndexComponent),
        canActivate: [aiModuleGuard]
    },
    {
        path: 'ai_module/chatsessions/view/:id',
        loadComponent: () => import('./pages/aichatsessions/ai-chat-sessions-view/ai-chat-sessions-view.component').then(m => m.AiChatSessionsViewComponent),
        canActivate: [aiModuleGuard]
    },
    {
        path: 'ai_module/auditlog/index',
        loadComponent: () => import('./pages/aiauditlog/ai-audit-log-index/ai-audit-log-index.component').then(m => m.AiAuditLogIndexComponent),
        canActivate: [aiModuleGuard]
    },
    {
        path: 'ai_module/settings/index',
        loadComponent: () => import('./pages/aisettings/ai-settings-index/ai-settings-index.component').then(m => m.AiSettingsIndexComponent),
        canActivate: [aiModuleGuard]
    }
];
