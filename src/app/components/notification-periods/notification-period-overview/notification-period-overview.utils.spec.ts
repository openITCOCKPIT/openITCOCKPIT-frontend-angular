import {
    computeOverview,
    intersect,
    MINUTES_PER_DAY,
    MINUTES_PER_WEEK,
    parseTime,
    resolveTimeperiod,
    resolveTimeperiods,
    subtract,
    toIntervals,
    union,
    weekMinuteOf
} from './notification-period-overview.utils';
import {
    Interval,
    NotificationOptions,
    NotificationPeriodContact,
    NotificationPeriodObject,
    NotificationPeriodTimeperiod,
    NotificationStateKey,
    ResolvedTimeperiod,
    TimeperiodTimerange,
    WeekDay
} from './notification-period-overview.interfaces';

const MON = 0;
const TUE = MINUTES_PER_DAY;

const i = (start: number, end: number, source = ''): Interval => ({start, end, source});
const tr = (day: WeekDay, start: string, end: string): TimeperiodTimerange => ({day, start, end});
const tp = (id: number, name: string, excludeTimeperiodId: number | null, timeranges: TimeperiodTimerange[]): NotificationPeriodTimeperiod =>
    ({id, name, excludeTimeperiodId, timeranges});
const byId = (timeperiods: NotificationPeriodTimeperiod[]) => new Map(timeperiods.map((t) => [t.id, t]));

/** Simple resolved timeperiod without excludes */
const period = (name: string, effective: Interval[]): ResolvedTimeperiod =>
    ({id: 1, name, excludes: [], effective, excluded: []});

const HOST_OPTIONS: NotificationOptions = {down: true, unreachable: true, recovery: true, flapping: false, downtime: false};
const DOWN: ReadonlySet<NotificationStateKey> = new Set<NotificationStateKey>(['down']);

const host = (effective: Interval[], overrides: Partial<NotificationPeriodObject> = {}): NotificationPeriodObject => ({
    id: 1,
    name: 'host',
    notificationsEnabled: true,
    notificationPeriodId: 1,
    notificationPeriod: period('host-notify', effective),
    options: HOST_OPTIONS,
    ...overrides
});

const contact = (id: number, effective: Interval[], overrides: Partial<NotificationPeriodContact> = {}): NotificationPeriodContact => ({
    id,
    name: `contact ${id}`,
    notificationsEnabled: true,
    notificationPeriodId: 1,
    notificationPeriod: period('contact-notify', effective),
    options: HOST_OPTIONS,
    ...overrides
});

describe('notification period overview utils', () => {

    describe('parseTime / toIntervals', () => {
        it('parses "HH:MM" into minutes', () => {
            expect(parseTime('00:00')).toBe(0);
            expect(parseTime('07:30')).toBe(450);
            expect(parseTime('24:00')).toBe(MINUTES_PER_DAY);
        });

        it('converts time ranges into sorted week minutes with the given source', () => {
            expect(toIntervals([tr(2, '07:30', '24:00'), tr(1, '08:00', '09:00')], 'x'))
                .toEqual([i(MON + 480, MON + 540, 'x'), i(TUE + 450, TUE + MINUTES_PER_DAY, 'x')]);
        });

        it('drops empty ranges', () => {
            expect(toIntervals([tr(1, '08:00', '08:00')], 'x')).toEqual([]);
        });
    });

    describe('union / subtract / intersect', () => {
        it('merges overlapping and touching intervals', () => {
            expect(union([i(10, 20), i(0, 5), i(5, 12), i(30, 40)])).toEqual([i(0, 20), i(30, 40)]);
        });

        it('splits an interval when cutting out the middle and keeps the source', () => {
            expect(subtract([i(0, 100, 'a')], [i(40, 60, 'b')])).toEqual([i(0, 40, 'a'), i(60, 100, 'a')]);
        });

        it('removes an interval that is covered completely', () => {
            expect(subtract([i(10, 20, 'a')], [i(0, 30)])).toEqual([]);
        });

        it('keeps intervals that do not overlap (half-open)', () => {
            expect(subtract([i(0, 10, 'a')], [i(10, 20)])).toEqual([i(0, 10, 'a')]);
        });

        it('intersects and keeps the source of the first argument', () => {
            expect(intersect([i(0, 100, 'a')], [i(20, 30, 'b'), i(50, 200, 'b')]))
                .toEqual([i(20, 30, 'a'), i(50, 100, 'a')]);
        });
    });

    describe('resolveTimeperiod', () => {
        const workhours = tp(1, 'workhours', 2, [tr(1, '07:00', '17:00'), tr(2, '07:00', '17:00')]);
        const lunch = tp(2, 'lunch', null, [tr(1, '12:00', '13:00'), tr(2, '12:00', '13:00')]);

        it('returns the time ranges as effective if there is no exclude', () => {
            const resolved = resolveTimeperiod(2, byId([lunch]));
            expect(resolved).toEqual({
                id: 2,
                name: 'lunch',
                excludes: [],
                effective: [i(MON + 720, MON + 780, 'lunch'), i(TUE + 720, TUE + 780, 'lunch')],
                excluded: []
            });
        });

        it('removes the exclude from effective and reports it as excluded with the exclude name', () => {
            const resolved = resolveTimeperiod(1, byId([workhours, lunch]));
            expect(resolved.excludes).toEqual(['lunch']);
            expect(resolved.effective).toEqual([
                i(MON + 420, MON + 720, 'workhours'), i(MON + 780, MON + 1020, 'workhours'),
                i(TUE + 420, TUE + 720, 'workhours'), i(TUE + 780, TUE + 1020, 'workhours')
            ]);
            expect(resolved.excluded).toEqual([i(MON + 720, MON + 780, 'lunch'), i(TUE + 720, TUE + 780, 'lunch')]);
        });

        it('resolves excludes recursively – the exclude of the exclude reactivates the time', () => {
            // lunch does not apply on tuesday
            const lunchExceptTuesday = tp(2, 'lunch', 3, lunch.timeranges);
            const tuesday = tp(3, 'tuesday', null, [tr(2, '00:00', '24:00')]);

            const resolved = resolveTimeperiod(1, byId([workhours, lunchExceptTuesday, tuesday]));
            expect(resolved.effective).toEqual([
                i(MON + 420, MON + 720, 'workhours'), i(MON + 780, MON + 1020, 'workhours'),
                i(TUE + 420, TUE + 1020, 'workhours')
            ]);
            expect(resolved.excluded).toEqual([i(MON + 720, MON + 780, 'lunch')]);
        });

        it('stops at circular excludes', () => {
            const a = tp(1, 'a', 2, [tr(1, '00:00', '24:00')]);
            const b = tp(2, 'b', 1, [tr(1, '10:00', '11:00')]);

            const resolved = resolveTimeperiod(1, byId([a, b]));
            expect(resolved.effective).toEqual([i(MON, MON + 600, 'a'), i(MON + 660, MON + MINUTES_PER_DAY, 'a')]);
            expect(resolved.excluded).toEqual([i(MON + 600, MON + 660, 'b')]);
        });

        it('ignores an exclude timeperiod that was not delivered', () => {
            const resolved = resolveTimeperiod(1, byId([workhours]));
            expect(resolved.excludes).toEqual([]);
            expect(resolved.excluded).toEqual([]);
            expect(resolved.effective.length).toBe(2);
        });

        it('returns an empty timeperiod for an unknown id', () => {
            expect(resolveTimeperiod(99, new Map()))
                .toEqual({id: 99, name: '', excludes: [], effective: [], excluded: []});
        });

        it('resolves all timeperiods indexed by id', () => {
            const resolved = resolveTimeperiods([workhours, lunch]);
            expect([...resolved.keys()]).toEqual([1, 2]);
            expect(resolved.get(1)!.excludes).toEqual(['lunch']);
        });
    });

    describe('computeOverview', () => {
        // Host notifies Monday 08:00–18:00
        const hostPeriod = [i(MON + 480, MON + 1080, 'host-notify')];

        it('reports no gap if a contact covers the whole host period', () => {
            const overview = computeOverview(host(hostPeriod), [contact(1, [i(MON, MON + MINUTES_PER_DAY)])], DOWN);
            expect(overview.gaps).toEqual([]);
            expect(overview.contacts[0].subscribed).toBeTrue();
            expect(overview.contacts[0].notified).toEqual([i(MON + 480, MON + 1080)]);
        });

        it('reports the uncovered part of the host period as gap', () => {
            const overview = computeOverview(host(hostPeriod), [contact(1, [i(MON + 480, MON + 720)])], DOWN);
            expect(overview.gaps).toEqual([i(MON + 720, MON + 1080)]);
        });

        it('marks contact time outside of the host period as blocked by the object', () => {
            const overview = computeOverview(host(hostPeriod), [contact(1, [i(MON + 420, MON + 540)])], DOWN);
            expect(overview.contacts[0].blockedByObject).toEqual([i(MON + 420, MON + 480)]);
        });

        it('does not count contacts with disabled notifications', () => {
            const overview = computeOverview(
                host(hostPeriod),
                [contact(1, [i(MON, MON + MINUTES_PER_DAY)], {notificationsEnabled: false})],
                DOWN
            );
            expect(overview.contacts[0].subscribed).toBeFalse();
            expect(overview.gaps).toEqual([i(MON + 480, MON + 1080)]);
        });

        it('does not count contacts that are not subscribed to the selected state', () => {
            const overview = computeOverview(
                host(hostPeriod),
                [contact(1, [i(MON, MON + MINUTES_PER_DAY)], {options: {...HOST_OPTIONS, down: false}})],
                DOWN
            );
            expect(overview.contacts[0].subscribed).toBeFalse();
            expect(overview.gaps).toEqual([i(MON + 480, MON + 1080)]);
        });

        it('treats the whole week as intended silence if the object has notifications disabled', () => {
            const overview = computeOverview(
                host(hostPeriod, {notificationsEnabled: false}),
                [contact(1, [i(MON, MON + MINUTES_PER_DAY)])],
                DOWN
            );
            expect(overview.gaps).toEqual([]);
            expect(overview.quiet).toEqual([i(0, MINUTES_PER_WEEK)]);
        });

        it('treats the whole week as intended silence if the object does not notify on the selected states', () => {
            const overview = computeOverview(host(hostPeriod), [], new Set<NotificationStateKey>(['flapping']));
            expect(overview.gaps).toEqual([]);
            expect(overview.quiet).toEqual([i(0, MINUTES_PER_WEEK)]);
        });

        it('reports the time outside of the host period as intended silence', () => {
            const overview = computeOverview(host(hostPeriod), [], DOWN);
            expect(overview.quiet).toEqual([i(0, MON + 480), i(MON + 1080, MINUTES_PER_WEEK)]);
        });
    });

    describe('weekMinuteOf', () => {
        it('counts the minutes since Monday 00:00 in local time', () => {
            expect(weekMinuteOf(new Date(2026, 9, 5, 0, 0))).toBe(0);                       // Monday
            expect(weekMinuteOf(new Date(2026, 9, 6, 7, 30))).toBe(TUE + 450);              // Tuesday
            expect(weekMinuteOf(new Date(2026, 9, 11, 23, 59))).toBe(MINUTES_PER_WEEK - 1); // Sunday
        });
    });
});
