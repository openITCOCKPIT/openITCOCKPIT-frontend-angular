import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MarkdownComponent } from 'ngx-markdown';
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
    RowComponent
} from '@coreui/angular';

import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { AiChatService } from '../ai-chat.service';
import {
    AiChatAgent,
    AiChatMessage,
    AiChatRecentSession,
    AiChatSessionHeader,
    AiChatTurnStatus,
    AiPendingConfirmation
} from '../ai-chat.interface';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

/**
 * The chat.
 *
 * Nothing here waits on a model. A message is handed to the queue and this
 * component polls for the result, so an answer that takes a minute costs a
 * spinner rather than a held connection.
 *
 * A conversation has its own URL, so it survives leaving the page and an
 * approval can link into the conversation it belongs to.
 */
@Component({
    selector: 'oitc-ai-chat-index',
    imports: [
        FormsModule,
        NgClass,
        RouterLink,
        TranslocoDirective,
        PermissionDirective,
        FaIconComponent,
        MarkdownComponent,
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
        XsButtonDirective
    ],
    templateUrl: './ai-chat-index.component.html',
    styleUrl: './ai-chat-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiChatIndexComponent implements OnInit, OnDestroy, AfterViewChecked {

    public agents: AiChatAgent[] = [];
    public recentSessions: AiChatRecentSession[] = [];

    public sessionId: number = 0;
    public sessionHeader: AiChatSessionHeader | null = null;

    public messages: AiChatMessage[] = [];
    public turn: AiChatTurnStatus | null = null;
    public pendingConfirmations: AiPendingConfirmation[] = [];

    public draft: string = '';
    public isStarting: boolean = false;
    public isSending: boolean = false;
    public isLoadingConversation: boolean = false;

    /** Comment typed alongside an approval or a rejection, per confirmation. */
    public decisionComments: { [confirmationId: number]: string } = {};

    @ViewChild('transcript') private transcript?: ElementRef<HTMLElement>;

    private lastMessageId: number = 0;
    private pollIntervalSeconds: number = 2;
    private pollSubscription?: Subscription;
    /** Set when new messages arrived, so the view scrolls once afterwards. */
    private shouldScroll: boolean = false;

    private readonly AiChatService = inject(AiChatService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly subscriptions: Subscription = new Subscription();

    public ngOnInit(): void {
        this.loadIndex();

        // The route decides whether this opens a conversation or the picker,
        // It is watched rather than read once, so switching conversations
        // does not rebuild the component.
        this.subscriptions.add(this.route.paramMap.subscribe(params => {
            const id = Number(params.get('id') || 0);
            if (id > 0) {
                this.openConversation(id);
            } else {
                this.closeConversation();
            }
        }));
    }

    public ngOnDestroy(): void {
        this.stopPolling();
        this.subscriptions.unsubscribe();
    }

    public ngAfterViewChecked(): void {
        if (!this.shouldScroll || !this.transcript) {
            return;
        }

        this.shouldScroll = false;
        const element = this.transcript.nativeElement;
        element.scrollTop = element.scrollHeight;
    }

    /**
     * Opens an agent's conversation.
     *
     * The backend reuses an open conversation with the same agent that was
     * never used, so clicking an agent twice does not leave empty ones behind.
     *
     * @param agent
     * @return void
     */
    public selectAgent(agent: AiChatAgent): void {
        if (this.isStarting) {
            return;
        }

        this.isStarting = true;
        this.subscriptions.add(this.AiChatService.start(agent.id).subscribe({
            next: (result) => {
                this.isStarting = false;
                // Navigated to rather than set as state, so the conversation
                // has an address from the start.
                this.router.navigate(['/ai_module/chat/index', result.AiChatSession.id]);
            },
            error: () => {
                this.isStarting = false;
                this.notyService.genericError();
                this.cdr.markForCheck();
            }
        }));
    }

    public send(): void {
        const message = this.draft.trim();
        if (message === '' || this.sessionId === 0 || this.isSending || this.isBusy()) {
            return;
        }

        this.isSending = true;
        this.subscriptions.add(this.AiChatService.send(this.sessionId, message).subscribe({
            next: (result) => {
                this.draft = '';
                this.isSending = false;
                this.turn = {
                    id: result.AiChatTurn.id,
                    state: result.AiChatTurn.state,
                    error_kind: null,
                    error_message: null
                };
                this.startPolling();
                // A conversation only reaches the list once it has been used,
                // so the first message is the moment it appears beside the
                // chat rather than after leaving the page.
                this.loadIndex();
                this.cdr.markForCheck();
            },
            error: (error) => {
                this.isSending = false;
                // 409 means a previous message is still being worked on, which
                // is a normal thing to run into by double clicking.
                if (error?.status === 409) {
                    this.notyService.genericError(
                        this.TranslocoService.translate('This conversation is still working on the previous message.')
                    );
                } else {
                    this.notyService.genericError();
                }
                this.cdr.markForCheck();
            }
        }));
    }

    public decide(confirmation: AiPendingConfirmation, approve: boolean): void {
        const comment = this.decisionComments[confirmation.id] || '';
        const request = approve
            ? this.AiChatService.confirm(confirmation.id, comment)
            : this.AiChatService.decline(confirmation.id, comment);

        this.subscriptions.add(request.subscribe({
            next: () => {
                delete this.decisionComments[confirmation.id];
                // Dropped immediately so the buttons cannot be pressed twice
                // while the next poll is in flight.
                this.pendingConfirmations = this.pendingConfirmations.filter(item => item.id !== confirmation.id);
                this.startPolling();
                this.cdr.markForCheck();
            },
            error: () => {
                this.notyService.genericError();
                this.cdr.markForCheck();
            }
        }));
    }

    public cancel(): void {
        if (this.turn === null) {
            return;
        }

        this.subscriptions.add(this.AiChatService.cancel(this.turn.id).subscribe(() => {
            this.startPolling();
            this.cdr.markForCheck();
        }));
    }

    public isBusy(): boolean {
        if (this.turn === null) {
            return false;
        }

        return this.turn.state === 'enqueued'
            || this.turn.state === 'running'
            || this.turn.state === 'awaiting_confirmation';
    }

    public isWaitingForApproval(): boolean {
        return this.turn !== null && this.turn.state === 'awaiting_confirmation';
    }

    /**
     * Whether the request hit a problem and is being tried again.
     *
     * A turn back in the queue still carries the error that put it there, and
     * showing it matters: a provider that is down for a minute otherwise looks
     * exactly like a model thinking hard, and the person waiting has nothing
     * to go on.
     *
     * @return bool
     */
    public isRetrying(): boolean {
        return this.turn !== null
            && this.turn.state === 'enqueued'
            && this.turn.error_message !== null;
    }

    public trackByMessageId(index: number, message: AiChatMessage): number {
        return message.id;
    }

    public trackByConfirmationId(index: number, confirmation: AiPendingConfirmation): number {
        return confirmation.id;
    }

    public trackBySessionId(index: number, session: AiChatRecentSession): number {
        return session.id;
    }

    /**
     * @return void
     */
    private loadIndex(): void {
        this.subscriptions.add(this.AiChatService.getIndex().subscribe(result => {
            this.agents = result.agents;
            this.recentSessions = result.recent_sessions;
            this.pollIntervalSeconds = result.poll_interval_seconds || 2;
            this.cdr.markForCheck();
        }));
    }

    /**
     * Loads one conversation from scratch.
     *
     * poll() with a cursor of zero returns the whole history, so reopening a
     * conversation needs no endpoint of its own.
     *
     * @param id
     * @return void
     */
    private openConversation(id: number): void {
        this.stopPolling();

        this.sessionId = id;
        this.messages = [];
        this.lastMessageId = 0;
        this.turn = null;
        this.pendingConfirmations = [];
        this.isLoadingConversation = true;
        this.cdr.markForCheck();

        this.subscriptions.add(this.AiChatService.poll(id, 0).subscribe({
            next: (result) => {
                this.applyPollResult(result.session, result.messages, result.turn, result.pending_confirmations);
                this.isLoadingConversation = false;

                // A conversation reopened while an answer is still being
                // worked on has to keep watching.
                if (this.isBusy()) {
                    this.startPolling();
                }

                this.cdr.markForCheck();
            },
            error: () => {
                this.isLoadingConversation = false;
                this.notyService.genericError(
                    this.TranslocoService.translate('This conversation could not be opened.')
                );
                this.router.navigate(['/ai_module/chat/index']);
            }
        }));
    }

    /**
     * @return void
     */
    private closeConversation(): void {
        this.stopPolling();
        this.sessionId = 0;
        this.sessionHeader = null;
        this.messages = [];
        this.lastMessageId = 0;
        this.turn = null;
        this.pendingConfirmations = [];
        // The list is stale the moment a conversation gained a title or a
        // message, and coming back to the picker is exactly when that shows.
        this.loadIndex();
        this.cdr.markForCheck();
    }

    /**
     * @param session
     * @param messages
     * @param turn
     * @param confirmations
     * @return void
     */
    private applyPollResult(
        session: AiChatSessionHeader | null,
        messages: AiChatMessage[],
        turn: AiChatTurnStatus | null,
        confirmations: AiPendingConfirmation[]
    ): void {
        if (session !== null) {
            this.sessionHeader = session;
        }

        if (messages.length > 0) {
            this.messages = this.messages.concat(messages);
            this.lastMessageId = messages[messages.length - 1].id;
            this.shouldScroll = true;
        }

        this.turn = turn;
        this.pendingConfirmations = confirmations;
    }

    /**
     * Polls faster while the model is working and slower while a human is,
     * because a person deciding on a write is not going to do it inside two
     * seconds and every poll costs a request.
     *
     * @return void
     */
    private startPolling(): void {
        this.stopPolling();

        const seconds = this.isWaitingForApproval() ? 5 : this.pollIntervalSeconds;

        this.pollSubscription = timer(0, seconds * 1000).subscribe(() => {
            this.AiChatService.poll(this.sessionId, this.lastMessageId).subscribe(result => {
                const wasWaiting = this.isWaitingForApproval();

                this.applyPollResult(result.session, result.messages, result.turn, result.pending_confirmations);

                if (!this.isBusy()) {
                    this.stopPolling();
                    // The turn is over, which is when the worker has given the
                    // conversation its written title and the message count has
                    // moved. Both are shown in the list beside this one.
                    this.loadIndex();
                } else if (wasWaiting !== this.isWaitingForApproval()) {
                    // The cadence belongs to the state, so re-arm on a change.
                    this.startPolling();
                }

                this.cdr.markForCheck();
            });
        });
    }

    /**
     * @return void
     */
    private stopPolling(): void {
        if (this.pollSubscription) {
            this.pollSubscription.unsubscribe();
            this.pollSubscription = undefined;
        }
    }
}
