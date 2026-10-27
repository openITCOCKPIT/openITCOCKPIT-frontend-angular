/**
 * Data contract for the notification period overview.
 *
 * The backend only delivers the raw data: the host or service, its contacts (each referencing its
 * notification period by id) and all used timeperiods incl. their exclude chain.
 *
 * The frontend resolves every timeperiod (incl. recursive excludes) into two lists:
 *  - effective: time ranges in which the timeperiod is active AFTER excludes were applied
 *  - excluded:  time ranges of the base timeperiod that were removed by an exclude
 * and then intersects the object (host or service) and its contacts and computes the coverage.
 */

/** 1 = Monday … 7 = Sunday (same as timeperiod_timeranges.day) */
export type WeekDay = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** Half-open interval [start, end) in minutes since Monday 00:00 */
export interface Interval {
    start: number;
    end: number;
    /** Name of the timeperiod this interval originates from (base timeperiod or exclude timeperiod) */
    source: string;
}

/** Type of the object the notification periods are shown for */
export type NotificationObjectType = 'host' | 'service';

export type HostNotificationStateKey = 'down' | 'unreachable' | 'recovery' | 'flapping' | 'downtime';
export type ServiceNotificationStateKey = 'warning' | 'critical' | 'unknown' | 'recovery' | 'flapping' | 'downtime';
export type NotificationStateKey = HostNotificationStateKey | ServiceNotificationStateKey;

/** Only contains the states of the object type (host or service) */
export type NotificationOptions = Partial<Record<NotificationStateKey, boolean>>;

/****************************
 *       API response       *
 ****************************/

export interface TimeperiodTimerange {
    day: WeekDay;
    /** "HH:MM" */
    start: string;
    /** "HH:MM", "24:00" allowed */
    end: string;
}

export interface NotificationPeriodTimeperiod {
    id: number;
    name: string;
    excludeTimeperiodId: number | null;
    timeranges: TimeperiodTimerange[];
}

/** Host or service as delivered by the backend */
export interface NotificationPeriodApiObject {
    id: number;
    name: string;
    /** Only set for services */
    hostname?: string;
    notificationsEnabled: boolean;
    notificationPeriodId: number;
    options: NotificationOptions;
}

export interface NotificationPeriodApiContact {
    id: number;
    name: string;
    notificationsEnabled: boolean;
    notificationPeriodId: number;
    options: NotificationOptions;
}

/** Response of hosts/notificationsOverview */
export interface HostNotificationPeriodOverviewResponse {
    host: NotificationPeriodApiObject;
    contacts: NotificationPeriodApiContact[];
    timeperiods: NotificationPeriodTimeperiod[];
}

/** Response of services/notificationsOverview */
export interface ServiceNotificationPeriodOverviewResponse {
    service: NotificationPeriodApiObject;
    contacts: NotificationPeriodApiContact[];
    timeperiods: NotificationPeriodTimeperiod[];
}

/****************************
 *  Resolved for component  *
 ****************************/

export interface ResolvedTimeperiod {
    id: number;
    name: string;
    /** Names of the directly assigned exclude timeperiods (for display only) */
    excludes: string[];
    effective: Interval[];
    excluded: Interval[];
}

/** Host or service with its resolved notification period */
export interface NotificationPeriodObject extends NotificationPeriodApiObject {
    notificationPeriod: ResolvedTimeperiod;
}

export interface NotificationPeriodContact extends NotificationPeriodApiContact {
    notificationPeriod: ResolvedTimeperiod;
}

/** Host and service response normalized and resolved for the component */
export interface NotificationPeriodOverviewData {
    object: NotificationPeriodObject;
    contacts: NotificationPeriodContact[];
}
