import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    OnDestroy,
    OnInit,
    signal
} from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { AlertComponent, TooltipDirective } from '@coreui/angular';
import {
    NotificationObjectType,
    NotificationPeriodContact,
    NotificationPeriodObject,
    NotificationPeriodOverviewData,
    NotificationStateKey
} from './notification-period-overview.interfaces';
import {
    computeOverview,
    Interval,
    MINUTES_PER_DAY,
    MINUTES_PER_WEEK,
    weekMinuteOf
} from './notification-period-overview.utils';
import { Subscription } from 'rxjs';
import { NotificationPeriodOverviewService } from './notification-period-overview.service';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';

interface Bar {
    left: number;
    width: number;
    title: string;
    /** Short "HH:MM–HH:MM" label drawn inside the bar if it is wide enough */
    label: string;
}

/** Minimum bar width (in % of the track) to render the label inside the bar */
const MIN_LABEL_WIDTH_PCT = 7;

interface Tick {
    left: number;
    label: string;
}

interface Separator {
    left: number;
    dashed: boolean;
}

/** Texts that differ between host and service */
interface ObjectTexts {
    disabled: string;
    notifiesOn: string;
    effective: string;
    excluded: string;
    blocked: string;
    veil: string;
    gap: string;
    quiet: string;
    contactDisabled: string;
    coverage: string;
    legendNotifies: string;
    legendBlocked: string;
}

interface ObjectTypeConfig {
    icon: IconProp;
    states: NotificationStateKey[];
    /** States that are selected in the toolbar if the host / service has no event types configured */
    defaultStates: NotificationStateKey[];
    texts: ObjectTexts;
}

const OBJECT_TYPES: Record<NotificationObjectType, ObjectTypeConfig> = {
    host: {
        icon: ['fas', 'desktop'],
        states: ['down', 'unreachable', 'recovery', 'flapping', 'downtime'],
        defaultStates: ['down', 'unreachable', 'recovery'],
        texts: {
            disabled: 'Notifications are disabled for this host.',
            notifiesOn: 'Host notifies on',
            effective: 'Host notifies: {{from}} – {{to}} (timeperiod {{tp}})',
            excluded: 'Host: {{from}} – {{to}} excluded by "{{tp}}"',
            blocked: '{{name}}: {{from}} – {{to}} contact active, but blocked by host notification period',
            veil: 'Host notification period inactive: {{from}} – {{to}}',
            gap: 'Gap: {{from}} – {{to}} – host would notify, but no contact is reachable',
            quiet: 'Intended silence: {{from}} – {{to}} – host does not notify',
            contactDisabled: 'Host notifications disabled',
            coverage: 'Host ∩ contacts',
            legendNotifies: 'Host notifies',
            legendBlocked: 'Blocked by host period'
        }
    },
    service: {
        icon: ['fas', 'gear'],
        states: ['warning', 'critical', 'unknown', 'recovery', 'flapping', 'downtime'],
        defaultStates: ['warning', 'critical', 'unknown', 'recovery'],
        texts: {
            disabled: 'Notifications are disabled for this service.',
            notifiesOn: 'Service notifies on',
            effective: 'Service notifies: {{from}} – {{to}} (timeperiod {{tp}})',
            excluded: 'Service: {{from}} – {{to}} excluded by "{{tp}}"',
            blocked: '{{name}}: {{from}} – {{to}} contact active, but blocked by service notification period',
            veil: 'Service notification period inactive: {{from}} – {{to}}',
            gap: 'Gap: {{from}} – {{to}} – service would notify, but no contact is reachable',
            quiet: 'Intended silence: {{from}} – {{to}} – service does not notify',
            contactDisabled: 'Service notifications disabled',
            coverage: 'Service ∩ contacts',
            legendNotifies: 'Service notifies',
            legendBlocked: 'Blocked by service period'
        }
    }
};

/** Coverage of a single notification event type that is configured at the host / service */
interface StateCoverageRow {
    state: NotificationStateKey;
    hasGaps: boolean;
    gaps: Bar[];
    quiet: Bar[];
}

interface ContactRow {
    id: number;
    name: string;
    timeperiod: string;
    excludes: string[];
    options: NotificationStateKey[];
    subscribed: boolean;
    notificationsEnabled: boolean;
    notified: Bar[];
    blocked: Bar[];
    excluded: Bar[];
}

@Component({
    selector: 'oitc-notification-period-overview',
    imports: [TranslocoPipe, FaIconComponent, AlertComponent, FaStackComponent, FaStackItemSizeDirective, TooltipDirective, TableLoaderComponent],
    templateUrl: './notification-period-overview.component.html',
    styleUrl: './notification-period-overview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationPeriodOverviewComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription = new Subscription();
    private readonly NotificationPeriodOverviewService = inject(NotificationPeriodOverviewService);

    /** Type of the object – decides which API is called and which states are shown */
    public readonly objectType = input<NotificationObjectType>('host');
    /** Id of the host or service to load the notification periods for */
    public readonly objectId = input.required<number>();

    protected readonly config = computed(() => OBJECT_TYPES[this.objectType()]);
    protected readonly texts = computed(() => this.config().texts);
    protected readonly states = computed(() => this.config().states);

    /** Response of hosts/notificationsOverview or services/notificationsOverview – null until loaded */
    private readonly data = signal<NotificationPeriodOverviewData | null>(null);
    protected readonly loaded = computed(() => this.data() !== null);
    protected readonly objectNotificationsEnabled = computed(() => this.data()?.object.notificationsEnabled ?? false);

    // Only read inside @if (loaded()) in the template
    private readonly object = computed<NotificationPeriodObject>(() => this.data()!.object);
    private readonly contacts = computed<NotificationPeriodContact[]>(() => this.data()!.contacts);
    /**
     * Optional "now" in minutes since Monday 00:00 (e.g. in the user's / server's timezone).
     * Falls back to the browser time.
     */
    public readonly nowWeekMinute = input<number | null>(null);

    private readonly transloco = inject(TranslocoService);

    protected readonly days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    protected readonly stateLabels: Record<NotificationStateKey, string> = {
        down: 'Down',
        unreachable: 'Unreachable',
        warning: 'Warning',
        critical: 'Critical',
        unknown: 'Unknown',
        recovery: 'Recovery',
        flapping: 'Flapping',
        downtime: 'Downtime'
    };
    protected readonly stateShort: Record<NotificationStateKey, string> = {
        down: 'D',
        unreachable: 'U',
        warning: 'W',
        critical: 'C',
        unknown: 'U',
        recovery: 'R',
        flapping: 'F',
        downtime: 'S'
    };
    /** Optional icon per state – replaces stateShort in the badge */
    protected readonly stateIcon: Partial<Record<NotificationStateKey, IconProp>> = {
        downtime: ['fas', 'power-off']
    };

    /** null = whole week, 0…6 = Monday…Sunday */
    protected readonly selectedDay = signal<number | null>(null);
    protected readonly enabledStates = signal<ReadonlySet<NotificationStateKey>>(new Set());
    protected readonly showExcludes = signal(true);
    protected readonly hoverText = signal('');

    private readonly clock = signal(weekMinuteOf(new Date()));
    private clockTimer?: ReturnType<typeof setInterval>;


    public ngOnInit() {
        //timer is used for the red now line
        this.clockTimer = setInterval(() => this.clock.set(weekMinuteOf(new Date())), 60_000);
        this.loadData();
    }


    public ngOnDestroy() {
        clearInterval(this.clockTimer);
        this.subscriptions.unsubscribe();
    }

    public loadData() {
        this.subscriptions.add(this.NotificationPeriodOverviewService.getNotificationsOverview(this.objectType(), this.objectId())
            .subscribe((data: NotificationPeriodOverviewData) => {
                // Preselect the event types the host / service is configured for
                const configured = this.states().filter((s) => data.object.options[s]);
                this.enabledStates.set(new Set(configured.length ? configured : this.config().defaultStates));
                this.data.set(data);
            }));
    }

    private readonly view = computed(() => {
        const day = this.selectedDay();
        return day === null
            ? {start: 0, end: MINUTES_PER_WEEK}
            : {start: day * MINUTES_PER_DAY, end: (day + 1) * MINUTES_PER_DAY};
    });

    private readonly overview = computed(() => computeOverview(this.object(), this.contacts(), this.enabledStates()));

    protected readonly dayTicks = computed<Tick[]>(() => {
        const day = this.selectedDay();
        if (day !== null) {
            return [{left: 50, label: this.t(this.days[day])}];
        }
        const {start, end} = this.view();
        return this.days.map((d, i) => ({
            left: this.pct(i * MINUTES_PER_DAY + MINUTES_PER_DAY / 2, start, end),
            label: this.t(d)
        }));
    });

    protected readonly hourTicks = computed<Tick[]>(() => {
        const ticks: Tick[] = [];
        if (this.selectedDay() === null) {
            const {start, end} = this.view();
            for (let d = 0; d < 7; d++) {
                for (const h of [6, 12, 18]) {
                    ticks.push({
                        left: this.pct(d * MINUTES_PER_DAY + h * 60, start, end),
                        label: String(h).padStart(2, '0')
                    });
                }
            }
            return ticks;
        }
        for (let h = 0; h <= 24; h += 3) {
            ticks.push({left: Math.min(Math.max((h / 24) * 100, 2), 97), label: String(h).padStart(2, '0') + ':00'});
        }
        return ticks;
    });

    protected readonly separators = computed<Separator[]>(() => {
        const {start, end} = this.view();
        const result: Separator[] = [];
        if (this.selectedDay() === null) {
            for (let d = 1; d < 7; d++) {
                result.push({left: this.pct(d * MINUTES_PER_DAY, start, end), dashed: false});
            }
        } else {
            for (let h = 6; h < 24; h += 6) {
                result.push({left: (h / 24) * 100, dashed: true});
            }
        }
        return result;
    });

    protected readonly nowLeft = computed<number | null>(() => {
        const now = this.nowWeekMinute() ?? this.clock();
        const {start, end} = this.view();
        return now >= start && now < end ? this.pct(now, start, end) : null;
    });

    protected readonly objectRow = computed(() => {
        const object = this.object();
        const texts = this.texts();
        const o = this.overview();
        return {
            name: object.name,
            hostname: object.hostname ?? '',
            timeperiod: object.notificationPeriod.name,
            excludes: object.notificationPeriod.excludes,
            options: this.states().filter((s) => object.options[s]),
            effective: this.bars(o.objectEffective, (from, to, i) =>
                this.t(texts.effective, {from, to, tp: i.source})),
            excluded: this.bars(o.objectExcluded, (from, to, i) =>
                this.t(texts.excluded, {from, to, tp: i.source}))
        };
    });

    /** Configured notification events of the host or service (read only) */
    protected readonly objectEvents = computed(() => {
        const options = this.object().options;
        return this.states().map((key) => ({key, enabled: options[key] ?? false}));
    });

    protected readonly contactRows = computed<ContactRow[]>(() => {
        const texts = this.texts();
        return this.overview().contacts.map((c) => {
            const name = c.contact.name;
            return {
                id: c.contact.id,
                name,
                timeperiod: c.contact.notificationPeriod.name,
                excludes: c.contact.notificationPeriod.excludes,
                options: this.states().filter((s) => c.contact.options[s]),
                subscribed: c.subscribed,
                notificationsEnabled: c.contact.notificationsEnabled,
                notified: this.bars(c.notified, (from, to) =>
                    this.t('{{name}}: {{from}} – {{to}} gets notified', {name, from, to})),
                blocked: this.bars(c.blockedByObject, (from, to) =>
                    this.t(texts.blocked, {name, from, to})),
                excluded: this.bars(c.excluded, (from, to, i) =>
                    this.t('{{name}}: {{from}} – {{to}} excluded by "{{tp}}"', {name, from, to, tp: i.source}))
            };
        });
    });

    /** Areas in which the host / service does not notify, drawn as veil across every contact row */
    protected readonly objectOffVeil = computed(() =>
        this.bars(this.overview().quiet, (from, to) => this.t(this.texts().veil, {from, to}))
    );

    protected readonly coverage = computed(() => {
        const o = this.overview();
        const texts = this.texts();
        return {
            gaps: this.bars(o.gaps, (from, to) => this.t(texts.gap, {from, to})),
            quiet: this.bars(o.quiet, (from, to) => this.t(texts.quiet, {from, to}))
        };
    });

    protected readonly hasGaps = computed(() => this.overview().gaps.length > 0);

    /** One coverage row per event type the host / service notifies on – independent of the toolbar selection */
    protected readonly stateCoverage = computed<StateCoverageRow[]>(() => {
        const object = this.object();
        const contacts = this.contacts();
        const texts = this.texts();
        return this.states()
            .filter((state) => object.options[state])
            .map((state) => {
                const o = computeOverview(object, contacts, new Set([state]));
                const label = this.t(this.stateLabels[state]);
                return {
                    state,
                    hasGaps: o.gaps.length > 0,
                    gaps: this.bars(o.gaps, (from, to) => `${label}: ${this.t(texts.gap, {from, to})}`),
                    quiet: this.bars(o.quiet, (from, to) => `${label}: ${this.t(texts.quiet, {from, to})}`)
                };
            });
    });

    protected toggleState(state: NotificationStateKey): void {
        this.enabledStates.update((current) => {
            const next = new Set(current);
            if (next.has(state)) {
                next.delete(state);
            } else {
                next.add(state);
            }
            return next;
        });
    }

    protected toggleExcludes(): void {
        this.showExcludes.update((v) => !v);
    }

    protected showLabel(width: number): boolean {
        return width >= MIN_LABEL_WIDTH_PCT;
    }

    private bars(intervals: Interval[], title: (from: string, to: string, interval: Interval) => string): Bar[] {
        const {start, end} = this.view();
        const span = end - start;
        const result: Bar[] = [];
        for (const i of intervals) {
            const s = Math.max(i.start, start);
            const e = Math.min(i.end, end);
            if (e <= s) {
                continue;
            }
            result.push({
                left: ((s - start) / span) * 100,
                width: ((e - s) / span) * 100,
                title: title(this.formatMinute(s, false), this.formatMinute(e, true), i),
                label: `${this.formatTime(s, false)}–${this.formatTime(e, true)}`
            });
        }
        return result;
    }

    private pct(minute: number, start: number, end: number): number {
        return ((minute - start) / (end - start)) * 100;
    }

    /** Formats "minutes since Monday" as "Mon 07:30". For range ends 00:00 is shown as 24:00 of the previous day. */
    private formatMinute(minute: number, isEnd: boolean): string {
        const day = Math.floor((isEnd && minute > 0 ? minute - 1 : minute) / MINUTES_PER_DAY);
        return `${this.t(this.days[day % 7])} ${this.formatTime(minute, isEnd)}`;
    }

    /** Formats "minutes since Monday" as "07:30". For range ends 00:00 is shown as 24:00. */
    private formatTime(minute: number, isEnd: boolean): string {
        let rest = minute % MINUTES_PER_DAY;
        if (isEnd && rest === 0 && minute > 0) {
            rest = MINUTES_PER_DAY;
        }
        const h = String(Math.floor(rest / 60)).padStart(2, '0');
        const m = String(rest % 60).padStart(2, '0');
        return `${h}:${m}`;
    }

    private t(key: string, params?: Record<string, string>): string {
        return this.transloco.translate(key, params);
    }
}
