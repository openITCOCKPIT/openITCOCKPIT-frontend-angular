import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective
} from '@coreui/angular';

import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { GenericValidationError } from '../../../../../generic-responses';
import { AiChatSessionsService } from '../ai-chat-sessions.service';
import { AiChatSession } from '../ai-chat-sessions.interface';
import { AiChatMessage } from '../../aichat/ai-chat.interface';
import { PermissionDirective } from '../../../../../permissions/permission.directive';

/**
 * A past conversation, read only.
 *
 * Someone else's conversation cannot be continued: the audit trail names who
 * asked, and a second author would misattribute it.
 */
@Component({
    selector: 'oitc-ai-chat-sessions-view',
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
        TableLoaderComponent
    ],
    templateUrl: './ai-chat-sessions-view.component.html',
    styleUrl: './ai-chat-sessions-view.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiChatSessionsViewComponent implements OnInit, OnDestroy {

    public session?: AiChatSession;
    public messages: AiChatMessage[] = [];
    public isLoading: boolean = true;

    private readonly AiChatSessionsService = inject(AiChatSessionsService);
    private readonly route = inject(ActivatedRoute);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly subscriptions: Subscription = new Subscription();

    public ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.AiChatSessionsService.view(id).subscribe(result => {
            this.session = result.AiChatSession;
            this.messages = result.messages;
            this.isLoading = false;
            this.cdr.markForCheck();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public trackByMessageId(index: number, message: AiChatMessage): number {
        return message.id;
    }
}
