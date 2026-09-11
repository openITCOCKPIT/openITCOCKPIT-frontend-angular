import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent,
    TableDirective
} from '@coreui/angular';

import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';

import { AiChatSessionsService } from '../ai-chat-sessions.service';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import {
    AiChatSession,
    AiChatSessionAgent,
    AiChatSessionsIndex,
    AiChatSessionsIndexParams,
    getDefaultAiChatSessionsIndexParams
} from '../ai-chat-sessions.interface';

/**
 * Past conversations.
 *
 * Which agent answered is the first thing worth knowing about one, so it is a
 * column rather than something to open the conversation for, and the agents
 * are a filter list beside the table.
 */
@Component({
    selector: 'oitc-ai-chat-sessions-index',
    imports: [
        FormsModule,
        NgClass,
        RouterLink,
        TranslocoDirective,
        PermissionDirective,
        FaIconComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        ContainerComponent,
        RowComponent,
        ColComponent,
        FormControlDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        TableDirective,
        XsButtonDirective,
        NoRecordsComponent,
        TableLoaderComponent,
        DebounceDirective,
        PaginateOrScrollComponent
    ],
    templateUrl: './ai-chat-sessions-index.component.html',
    styleUrl: './ai-chat-sessions-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiChatSessionsIndexComponent implements OnInit, OnDestroy {

    public result?: AiChatSessionsIndex;
    public sessions: AiChatSession[] = [];
    public agents: AiChatSessionAgent[] = [];
    public isLoading: boolean = true;

    public params: AiChatSessionsIndexParams = getDefaultAiChatSessionsIndexParams();

    /** Page sizes offered beside the table. */
    public readonly pageSizes: number[] = [10, 25, 50, 100];

    private readonly AiChatSessionsService = inject(AiChatSessionsService);
    private readonly notyService = inject(NotyService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly subscriptions: Subscription = new Subscription();

    public ngOnInit(): void {
        this.load();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load(): void {
        this.isLoading = true;
        this.subscriptions.add(this.AiChatSessionsService.getIndex(this.params).subscribe(result => {
            this.result = result;
            this.sessions = result.all_sessions;
            // Kept across loads so the filter list does not empty out the
            // moment a filter narrows the table to one agent.
            if (result.agents && result.agents.length > 0) {
                this.agents = result.agents;
            }
            this.isLoading = false;
            this.cdr.markForCheck();
        }));
    }

    public get totalConversations(): number {
        return this.agents.reduce((sum, agent) => sum + agent.count, 0);
    }

    public get selectedAgentId(): number | '' {
        return this.params['filter[AiChatSessions.ai_agent_id]'];
    }

    public filterByAgent(agentId: number | ''): void {
        this.params['filter[AiChatSessions.ai_agent_id]'] = agentId;
        this.params.page = 1;
        this.load();
    }

    public onFilterChange(): void {
        this.params.page = 1;
        this.load();
    }

    public onPageSizeChange(size: number): void {
        this.params.limit = size;
        this.params.page = 1;
        this.load();
    }

    public onPaginatorChange(event: PaginatorChangeEvent): void {
        this.params.page = event.page;
        this.params.scroll = event.scroll;
        this.load();
    }

    public archive(session: AiChatSession): void {
        this.subscriptions.add(this.AiChatSessionsService.archive(session.id).subscribe({
            next: () => {
                this.notyService.genericSuccess();
                this.load();
            },
            error: () => this.notyService.genericError()
        }));
    }

    public delete(session: AiChatSession): void {
        this.subscriptions.add(this.AiChatSessionsService.delete(session.id).subscribe({
            next: () => {
                this.notyService.genericSuccess();
                this.load();
            },
            error: () => this.notyService.genericError()
        }));
    }

    public trackById(index: number, session: AiChatSession): number {
        return session.id;
    }
}
