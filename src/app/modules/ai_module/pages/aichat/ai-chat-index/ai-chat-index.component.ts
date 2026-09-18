import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
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
    AiChatEntry,
    AiChatMessage,
    AiChatRecentSession,
    AiChatSessionHeader,
    AiChatToolStep,
    AiChatTurnStatus,
    AiPendingConfirmation
} from '../ai-chat.interface';
import { AiChatSessionsService } from '../../aichatsessions/ai-chat-sessions.service';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {
    CopyToClipboardComponent
} from '../../../../../layouts/coreui/copy-to-clipboard/copy-to-clipboard.component';

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
        XsButtonDirective,
        CopyToClipboardComponent
    ],
    templateUrl: './ai-chat-index.component.html',
    styleUrl: './ai-chat-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiChatIndexComponent implements OnInit, OnDestroy, AfterViewChecked {

    /**
     * What is left below the card.
     *
     * A fixed value rather than one derived from the spacing beside the card:
     * the gap on the right is the sum of a container's and a column's padding,
     * which is not what belongs under a card that should reach the bottom.
     */
    private static readonly BOTTOM_GAP: number = 12;

    public agents: AiChatAgent[] = [];
    public recentSessions: AiChatRecentSession[] = [];

    public sessionId: number = 0;
    public sessionHeader: AiChatSessionHeader | null = null;

    public messages: AiChatMessage[] = [];
    /** What the transcript renders: messages, with tool work folded together. */
    public entries: AiChatEntry[] = [];
    public turn: AiChatTurnStatus | null = null;
    public pendingConfirmations: AiPendingConfirmation[] = [];

    /** The tools of this conversation's agent, and whether they are listed. */
    public tools: string[] = [];
    public showTools: boolean = false;
    private toolsTimeout?: ReturnType<typeof setTimeout>;

    /** Which conversation in the list is being renamed or asked about. */
    public renamingSessionId: number = 0;
    public renameDraft: string = '';
    public deletingSessionId: number = 0;

    /** Shown when the transcript is scrolled away from the newest message. */
    public isScrolledUp: boolean = false;

    /**
     * What the wait says while no tool is running.
     *
     * Left untranslated: these are the sounds and verbs of a monitoring
     * system rather than sentences, and several of them have no equivalent
     * in the other six languages.
     */
    private readonly waitingWords: string[] = [
        'Monitoring', 'Polling', 'Probing', 'Correlating', 'Transmitting',
        'Beeping', 'Bopping', 'Blinking', 'Humming', 'Ticking', 'Buzzing',
        'Scraping metrics', 'Checking hosts', 'Pinging services',
        'Walking the MIB', 'Asking Naemon', 'Nudging Gearman',
        'Draining the queue', 'Warming the carbon cache', 'Consulting Graphite',
        'Reticulating checks', 'Counting soft states', 'Chasing a flapping host',
        'Acknowledging', 'Escalating', 'Rotating logs', 'Reloading the config',
        'Resolving downtimes', 'Following a dependency', 'Untangling parents',
        'Sorting by severity', 'Reading plugin output', 'Diffing thresholds',
        'Waiting for the next check', 'Second-guessing a timeout',
        'Blaming DNS', 'Looking busy'
    ];
    public waitingWord: string = '';
    private waitingSubscription?: Subscription;

    public draft: string = '';
    public isStarting: boolean = false;
    public isSending: boolean = false;
    public isLoadingConversation: boolean = false;

    /** Comment typed alongside an approval or a rejection, per confirmation. */
    public decisionComments: { [confirmationId: number]: string } = {};

    @ViewChild('transcript') private transcript?: ElementRef<HTMLElement>;
    @ViewChild('draftInput') private draftInput?: ElementRef<HTMLTextAreaElement>;
    // read: ElementRef is required. Both references sit on <c-card>, which is
    // a component, and a plain @ViewChild on a component element hands back
    // the component instance - nativeElement is then undefined and the height
    // correction below silently does nothing.
    @ViewChild('chatColumn', {read: ElementRef}) private chatColumn?: ElementRef<HTMLElement>;
    @ViewChild('listColumn', {read: ElementRef}) private listColumn?: ElementRef<HTMLElement>;

    private lastMessageId: number = 0;
    private pollIntervalSeconds: number = 2;
    private pollSubscription?: Subscription;
    /** Set when new messages arrived, so the view scrolls once afterwards. */
    private shouldScroll: boolean = false;
    /** Set once after opening a conversation, to put the cursor in the box. */
    private shouldFocusDraft: boolean = false;
    @ViewChild('transcriptContent') private transcriptContent?: ElementRef<HTMLElement>;
    /**
     * Keeps the transcript at the newest message while the reader is there.
     *
     * Answers render as Markdown and keep growing for a few frames after they
     * arrive, and the card itself is resized to the window. Following every
     * change in size catches all of that, where one scroll or a fixed time
     * falls short. It stops as soon as the reader scrolls up, because only
     * then does isScrolledUp turn true.
     */
    private sizeObserver?: ResizeObserver;
    private observedContent?: HTMLElement;

    private readonly AiChatService = inject(AiChatService);
    private readonly AiChatSessionsService = inject(AiChatSessionsService);
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
        this.sizeObserver?.disconnect();
        this.holdTools();
        this.stopPolling();
        this.subscriptions.unsubscribe();
    }

    /**
     * Sizes both cards to the space left on screen.
     *
     * Measured rather than calculated: the shell's header, this page's
     * breadcrumb and the footer all contribute, and a subtraction of fixed
     * rem values would be a guess that breaks the moment any of them change.
     *
     * @return void
     */
    @HostListener('window:resize')
    public applyHeights(): void {
        // Corrects the bottom edge instead of computing the height from the
        // top. Anything between - the header, the breadcrumb, a margin, a
        // footer in the flow - is already accounted for in where the card
        // actually ends, so nothing about the page has to be assumed. Called
        // from ngAfterViewChecked, so it converges within a frame or two.
        const footer = document.querySelector('footer, .footer, oitc-coreui-footer') as HTMLElement | null;
        const footerTop = footer && footer.offsetHeight > 0
            ? footer.getBoundingClientRect().top
            : Number.POSITIVE_INFINITY;

        for (const column of [this.chatColumn, this.listColumn]) {
            const element = column?.nativeElement;
            if (!element) {
                continue;
            }

            const box = element.getBoundingClientRect();
            const wanted = Math.min(footerTop, window.innerHeight) - AiChatIndexComponent.BOTTOM_GAP;
            const delta = wanted - box.bottom;

            // A pixel of slack, or the correction chases its own rounding.
            if (Math.abs(delta) > 1) {
                element.style.height = Math.max(box.height + delta, 320) + 'px';
            }
        }
    }

    public ngAfterViewChecked(): void {
        this.applyHeights();

        if (this.shouldFocusDraft && this.draftInput) {
            this.shouldFocusDraft = false;
            this.draftInput.nativeElement.focus();
        }

        this.observeTranscript();

        if (!this.shouldScroll || !this.transcript) {
            return;
        }

        this.shouldScroll = false;
        // Only follow along for somebody who is already at the bottom.
        // Scrolling back to read a tool result is a deliberate act, and a poll
        // arriving two seconds later must not undo it.
        if (!this.isScrolledUp) {
            this.scrollToLatest();
        }
    }

    /**
     * Opens or closes the list of tools.
     *
     * @param event
     * @return void
     */
    public toggleTools(event: Event): void {
        // Without this the document listener below sees the same click and
        // closes the bubble in the moment it opens.
        event.stopPropagation();

        this.showTools = !this.showTools;
        this.showTools ? this.releaseTools() : this.holdTools();
    }

    /**
     * Closes the bubble on a click anywhere else.
     *
     * @return void
     */
    @HostListener('document:click')
    public closeTools(): void {
        if (!this.showTools) {
            return;
        }

        this.showTools = false;
        this.holdTools();
        this.cdr.markForCheck();
    }

    /**
     * Keeps the bubble open while it is being read.
     *
     * @return void
     */
    public holdTools(): void {
        if (this.toolsTimeout) {
            clearTimeout(this.toolsTimeout);
            this.toolsTimeout = undefined;
        }
    }

    /**
     * Closes the bubble shortly after the cursor leaves it.
     *
     * @return void
     */
    public releaseTools(): void {
        this.holdTools();

        this.toolsTimeout = setTimeout(() => {
            this.showTools = false;
            this.cdr.markForCheck();
        }, 4000);
    }

    /**
     * Follows changes in size to the newest message, unless the reader has
     * scrolled away from it.
     *
     * The content element comes and goes with the conversation, so the
     * observer moves to a new one whenever the element changes.
     *
     * @return void
     */
    private observeTranscript(): void {
        const content = this.transcriptContent?.nativeElement;
        if (!content || content === this.observedContent || !this.transcript) {
            return;
        }

        this.sizeObserver?.disconnect();
        this.sizeObserver = new ResizeObserver(() => {
            if (!this.isScrolledUp) {
                this.scrollToLatest();
            }
        });
        this.sizeObserver.observe(content);
        this.sizeObserver.observe(this.transcript.nativeElement);
        this.observedContent = content;
    }

    public scrollToLatest(): void {
        if (!this.transcript) {
            return;
        }

        const element = this.transcript.nativeElement;
        element.scrollTop = element.scrollHeight;
        this.isScrolledUp = false;
    }

    /**
     * Tracks whether the newest message is in view.
     *
     * The threshold is in pixels rather than exact, because a transcript
     * rendered to the last pixel still counts as "at the bottom" for somebody
     * reading it.
     *
     * @return void
     */
    public onTranscriptScroll(): void {
        if (!this.transcript) {
            return;
        }

        const element = this.transcript.nativeElement;
        const distance = element.scrollHeight - element.scrollTop - element.clientHeight;
        const scrolledUp = distance > 80;

        if (scrolledUp !== this.isScrolledUp) {
            this.isScrolledUp = scrolledUp;
            this.cdr.markForCheck();
        }
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
                // Sending is the one moment the view should follow along even
                // if the person had scrolled back.
                this.isScrolledUp = false;
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

    /**
     * Sends on Enter, breaks the line on Shift+Enter.
     *
     * A question about monitoring often carries a pasted log line or a piece
     * of check output, so the box has to hold more than one line - but Enter
     * staying the way to send is what everybody expects of a chat.
     *
     * @param event
     * @return void
     */
    public onDraftKeydown(event: KeyboardEvent): void {
        if (event.key !== 'Enter' || event.shiftKey) {
            return;
        }

        event.preventDefault();
        this.send();
    }

    /**
     * Grows the box with its content, up to a point.
     *
     * @param element
     * @return void
     */
    public autoGrow(element: HTMLTextAreaElement): void {
        element.style.height = 'auto';
        element.style.height = Math.min(element.scrollHeight, 200) + 'px';
    }

    public startRename(session: AiChatRecentSession, event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        this.deletingSessionId = 0;
        this.renamingSessionId = session.id;
        this.renameDraft = session.title || '';
    }

    public cancelRename(): void {
        this.renamingSessionId = 0;
        this.renameDraft = '';
    }

    public confirmRename(): void {
        const id = this.renamingSessionId;
        const title = this.renameDraft.trim();
        if (id === 0 || title === '') {
            this.cancelRename();
            return;
        }

        this.subscriptions.add(this.AiChatSessionsService.rename(id, title).subscribe({
            next: () => {
                this.cancelRename();
                // A title typed by a person is never overwritten by the one
                // the backend writes, so the list only has to catch up.
                this.loadIndex();
                if (id === this.sessionId && this.sessionHeader !== null) {
                    this.sessionHeader = {...this.sessionHeader, title: title};
                }
                this.cdr.markForCheck();
            },
            error: () => {
                this.notyService.genericError();
                this.cdr.markForCheck();
            }
        }));
    }

    public askDelete(session: AiChatRecentSession, event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        this.cancelRename();
        this.deletingSessionId = session.id;
    }

    public cancelDelete(): void {
        this.deletingSessionId = 0;
    }

    public confirmDelete(): void {
        const id = this.deletingSessionId;
        if (id === 0) {
            return;
        }

        this.subscriptions.add(this.AiChatSessionsService.delete(id).subscribe({
            next: () => {
                this.deletingSessionId = 0;
                // Deleting the conversation on screen leaves nothing to show,
                // so it goes back to the picker rather than to an empty one.
                if (id === this.sessionId) {
                    this.router.navigate(['/ai_module/chat/index']);
                } else {
                    this.loadIndex();
                }
                this.cdr.markForCheck();
            },
            error: () => {
                this.notyService.genericError();
                this.cdr.markForCheck();
            }
        }));
    }

    /**
     * Whether a round of tool work contains a failure.
     *
     * Shown on the closed block, because a failure is the one thing somebody
     * needs to know without opening it.
     *
     * @param steps
     * @return boolean
     */
    public hasFailed(steps: AiChatToolStep[]): boolean {
        return steps.some(step => step.is_error);
    }

    public trackByEntryId(index: number, entry: AiChatEntry): number {
        return entry.id;
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
        this.tools = [];
        this.showTools = false;
        this.messages = [];
        this.entries = [];
        this.lastMessageId = 0;
        this.turn = null;
        this.pendingConfirmations = [];
        this.isLoadingConversation = true;
        this.cdr.markForCheck();

        this.subscriptions.add(this.AiChatService.poll(id, 0).subscribe({
            next: (result) => {
                this.applyPollResult(result.session, result.messages, result.turn, result.pending_confirmations);
                this.isLoadingConversation = false;
                this.shouldFocusDraft = true;
                // Opened at the newest message. The size observer keeps it
                // there while the answers finish rendering.
                this.isScrolledUp = false;
                this.shouldScroll = true;

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
        this.entries = [];
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
            // Sent only with the full load, so a poll must not clear it.
            if (session.tools !== null) {
                this.tools = session.tools;
            }
        }

        if (messages.length > 0) {
            this.messages = this.messages.concat(messages);
            this.lastMessageId = messages[messages.length - 1].id;
            this.entries = this.buildEntries(this.messages);
            this.shouldScroll = true;
        }

        this.turn = turn;
        this.pendingConfirmations = confirmations;
    }

    /**
     * Folds a run of tool work into one entry.
     *
     * A single question can produce an assistant message asking for three
     * tools and three results answering them - six entries of machinery around
     * one sentence of answer. They are evidence, wanted on demand and in the
     * way otherwise, so a run collapses into one closed block.
     *
     * Call and result arrive as separate messages, the call being stored
     * before it runs. They are paired by tool_call_id where both carry one,
     * and by name otherwise, so a result always lands on the call it answers.
     *
     * @param messages
     * @return AiChatEntry[]
     */
    private buildEntries(messages: AiChatMessage[]): AiChatEntry[] {
        const entries: AiChatEntry[] = [];
        let group: { kind: 'tools', id: number, steps: AiChatToolStep[], reasoning: string | null } | null = null;

        for (const message of messages) {
            const asksForTools = message.role === 'assistant' && message.tool_calls?.length > 0;
            const isResult = message.role === 'tool';

            if (!asksForTools && !isResult) {
                group = null;
                entries.push({kind: 'message', id: message.id, message: message});
                continue;
            }

            if (group === null) {
                group = {kind: 'tools', id: message.id, steps: [], reasoning: null};
                entries.push(group);
            }

            if (asksForTools) {
                // Why these calls and not others, kept with the calls it
                // produced. Only a reasoning model sends any, and a round
                // without one simply has none.
                if (message.reasoning && !group.reasoning) {
                    group.reasoning = message.reasoning;
                }

                for (const call of message.tool_calls) {
                    group.steps.push({
                        name: call.name,
                        arguments: call.arguments,
                        result: null,
                        is_error: false,
                        pending: true
                    });
                }
            }

            if (isResult) {
                const open = group.steps.find(step => step.pending && step.name === message.tool_name);
                if (open) {
                    open.result = message.content;
                    open.is_error = message.is_error;
                    open.pending = false;
                } else {
                    // A result without a call in view: the history was trimmed,
                    // or the worker recorded one without the other. Shown on
                    // its own rather than dropped.
                    group.steps.push({
                        name: message.tool_name || '',
                        arguments: '',
                        result: message.content,
                        is_error: message.is_error,
                        pending: false
                    });
                }
            }

            // An assistant message can carry both an answer and a request for
            // more tools. The sentence belongs in the transcript either way.
            if (asksForTools && message.content) {
                group = null;
                entries.push({kind: 'message', id: message.id, message: message});
            }
        }

        return entries;
    }

    /**
     * What the assistant is doing right now, for the waiting line.
     *
     * @return string
     */
    public runningToolName(): string {
        for (let i = this.entries.length - 1; i >= 0; i--) {
            const entry = this.entries[i];
            if (entry.kind !== 'tools') {
                continue;
            }

            const pending = entry.steps.find(step => step.pending);
            return pending ? pending.name : '';
        }

        return '';
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
        this.startWaitingWords();

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

        this.stopWaitingWords();
    }

    /**
     * Cycles the waiting word while an answer is being worked on.
     *
     * Slower than the poll: the word is there to show that something is still
     * happening, and one that changes every two seconds reads as noise.
     *
     * @return void
     */
    private startWaitingWords(): void {
        this.stopWaitingWords();

        // Starts anywhere in the list and steps on from there, so two waits in
        // a row do not open with the same word.
        const offset = Math.floor(Math.random() * this.waitingWords.length);

        this.waitingSubscription = timer(0, 3500).subscribe(tick => {
            this.waitingWord = this.waitingWords[(offset + tick) % this.waitingWords.length];
            this.cdr.markForCheck();
        });
    }

    /**
     * @return void
     */
    private stopWaitingWords(): void {
        if (this.waitingSubscription) {
            this.waitingSubscription.unsubscribe();
            this.waitingSubscription = undefined;
        }
    }
}
