import {
    Interval,
    NotificationOptions,
    NotificationPeriodContact,
    NotificationPeriodObject,
    NotificationPeriodTimeperiod,
    NotificationStateKey,
    ResolvedTimeperiod,
    TimeperiodTimerange
} from './notification-period-overview.interfaces';

export type { Interval } from './notification-period-overview.interfaces';

export const MINUTES_PER_DAY = 1440;
export const MINUTES_PER_WEEK = 7 * MINUTES_PER_DAY;

export interface ContactCoverage {
    contact: NotificationPeriodContact;
    /** Contact has notifications enabled AND contact and object are subscribed to at least one of the selected states */
    subscribed: boolean;
    /** Contact period ∩ object period → notifications are sent */
    notified: Interval[];
    /** Contact period active, but object period inactive → blocked */
    blockedByObject: Interval[];
    /** Removed from the contact period by an exclude */
    excluded: Interval[];
}

export interface NotificationPeriodOverview {
    objectEffective: Interval[];
    objectExcluded: Interval[];
    contacts: ContactCoverage[];
    /** Object would notify, but no contact is reachable */
    gaps: Interval[];
    /** Object period inactive (or object not subscribed to the selected states) → intended silence */
    quiet: Interval[];
}

export function parseTime(value: string): number {
    const [h, m] = value.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
}

/** Converts the time ranges of a timeperiod into intervals, all with the given source (timeperiod name) */
export function toIntervals(ranges: TimeperiodTimerange[], source: string): Interval[] {
    return ranges
        .map((r) => {
            const offset = (r.day - 1) * MINUTES_PER_DAY;
            return {start: offset + parseTime(r.start), end: offset + parseTime(r.end), source};
        })
        .filter((i) => i.end > i.start)
        .sort((a, b) => a.start - b.start || a.end - b.end);
}

/** Merges overlapping / touching intervals. Sources get lost – only use for calculations. */
export function union(intervals: Interval[]): Interval[] {
    const sorted = [...intervals].sort((a, b) => a.start - b.start);
    const result: Interval[] = [];
    for (const i of sorted) {
        const last = result[result.length - 1];
        if (last && i.start <= last.end) {
            last.end = Math.max(last.end, i.end);
        } else {
            result.push({start: i.start, end: i.end, source: ''});
        }
    }
    return result;
}

/** a − b, keeps the source of a */
export function subtract(a: Interval[], b: Interval[]): Interval[] {
    const cuts = union(b);
    const result: Interval[] = [];
    for (const i of a) {
        let parts: Interval[] = [{...i}];
        for (const c of cuts) {
            const next: Interval[] = [];
            for (const p of parts) {
                if (c.end <= p.start || c.start >= p.end) {
                    next.push(p);
                    continue;
                }
                if (c.start > p.start) {
                    next.push({start: p.start, end: c.start, source: p.source});
                }
                if (c.end < p.end) {
                    next.push({start: c.end, end: p.end, source: p.source});
                }
            }
            parts = next;
        }
        result.push(...parts);
    }
    return result;
}

/** a ∩ b, keeps the source of a */
export function intersect(a: Interval[], b: Interval[]): Interval[] {
    const other = union(b);
    const result: Interval[] = [];
    for (const i of a) {
        for (const o of other) {
            const start = Math.max(i.start, o.start);
            const end = Math.min(i.end, o.end);
            if (end > start) {
                result.push({start, end, source: i.source});
            }
        }
    }
    return result;
}

/**
 * Time ranges in which the timeperiod is active, incl. its recursive excludes (like Naemon does:
 * an exclude timeperiod is only active during its own time ranges minus its own exclude, and so on).
 *
 * @param visited ids of the timeperiods already on the exclude chain (loop protection)
 */
function activeIntervals(id: number, timeperiods: Map<number, NotificationPeriodTimeperiod>, visited: ReadonlySet<number>): Interval[] {
    const timeperiod = timeperiods.get(id);
    if (!timeperiod || visited.has(id)) {
        return [];
    }

    const intervals = toIntervals(timeperiod.timeranges, timeperiod.name);
    if (timeperiod.excludeTimeperiodId === null) {
        return intervals;
    }

    const excludeActive = activeIntervals(timeperiod.excludeTimeperiodId, timeperiods, new Set([...visited, id]));
    return subtract(intervals, excludeActive);
}

/** Resolves a timeperiod incl. its recursive excludes into effective and excluded intervals */
export function resolveTimeperiod(id: number, timeperiods: Map<number, NotificationPeriodTimeperiod>): ResolvedTimeperiod {
    const timeperiod = timeperiods.get(id);
    if (!timeperiod) {
        return {id, name: '', excludes: [], effective: [], excluded: []};
    }

    const base = toIntervals(timeperiod.timeranges, timeperiod.name);
    const excludeId = timeperiod.excludeTimeperiodId;
    const exclude = excludeId !== null ? timeperiods.get(excludeId) : undefined;
    if (excludeId === null || !exclude) {
        return {id, name: timeperiod.name, excludes: [], effective: base, excluded: []};
    }

    const excludeActive = activeIntervals(excludeId, timeperiods, new Set([id]));
    return {
        id,
        name: timeperiod.name,
        excludes: [exclude.name],
        effective: subtract(base, excludeActive),
        // intersect keeps the source of the first argument → the excluded ranges carry the exclude's name
        excluded: intersect(excludeActive, base)
    };
}

/** Resolves all timeperiods delivered by the backend, indexed by id */
export function resolveTimeperiods(timeperiods: NotificationPeriodTimeperiod[]): Map<number, ResolvedTimeperiod> {
    const byId = new Map(timeperiods.map((t) => [t.id, t]));
    return new Map(timeperiods.map((t) => [t.id, resolveTimeperiod(t.id, byId)]));
}

function isSubscribed(options: NotificationOptions, states: ReadonlySet<NotificationStateKey>): boolean {
    for (const s of states) {
        if (options[s]) {
            return true;
        }
    }
    return false;
}

export function computeOverview(
    object: NotificationPeriodObject,
    contacts: NotificationPeriodContact[],
    states: ReadonlySet<NotificationStateKey>
): NotificationPeriodOverview {
    const fullWeek: Interval[] = [{start: 0, end: MINUTES_PER_WEEK, source: ''}];
    const objectEffective = object.notificationPeriod.effective;
    const objectExcluded = object.notificationPeriod.excluded;
    const objectOff = subtract(fullWeek, objectEffective);

    // Only states the object (host or service) itself notifies about are relevant (none, if the object has notifications disabled)
    const objectStates = new Set([...states].filter((s) => object.notificationsEnabled && object.options[s]));

    const contactCoverage: ContactCoverage[] = contacts.map((contact) => {
        const effective = contact.notificationPeriod.effective;
        return {
            contact,
            subscribed: contact.notificationsEnabled && isSubscribed(contact.options, objectStates),
            notified: intersect(effective, objectEffective),
            blockedByObject: intersect(effective, objectOff),
            excluded: contact.notificationPeriod.excluded
        };
    });

    if (objectStates.size === 0) {
        return {objectEffective, objectExcluded, contacts: contactCoverage, gaps: [], quiet: fullWeek};
    }

    const reachable = contactCoverage.filter((c) => c.subscribed).flatMap((c) => c.notified);

    return {
        objectEffective,
        objectExcluded,
        contacts: contactCoverage,
        gaps: union(subtract(objectEffective, reachable)),
        quiet: union(objectOff)
    };
}

/** Minutes since Monday 00:00 in the browser's local time */
export function weekMinuteOf(date: Date): number {
    return ((date.getDay() + 6) % 7) * MINUTES_PER_DAY + date.getHours() * 60 + date.getMinutes();
}
