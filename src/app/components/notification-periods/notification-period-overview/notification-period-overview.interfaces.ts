/**
 * Data contract for the notification period overview.
 *
 * The backend resolves every timeperiod (incl. recursive excludes) and delivers two lists:
 *  - effective: time ranges in which the timeperiod is active AFTER excludes were applied
 *  - excluded:  time ranges of the base timeperiod that were removed by an exclude
 *
 * The frontend only intersects the object (host or service) and its contacts and computes the coverage.
 */

/** 1 = Monday … 7 = Sunday (same as timeperiod_timeranges.day) */
export type WeekDay = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface NotificationPeriodTimeRange {
    day: WeekDay;
    /** "HH:MM" */
    start: string;
    /** "HH:MM", "24:00" allowed */
    end: string;
    /** Name of the timeperiod this range originates from (base timeperiod or exclude timeperiod) */
    timeperiod: string;
}

export interface ResolvedTimeperiod {
    id: number;
    name: string;
    excludes: string[];
    effective: NotificationPeriodTimeRange[];
    excluded: NotificationPeriodTimeRange[];
}

/** Type of the object the notification periods are shown for */
export type NotificationObjectType = 'host' | 'service';

export type HostNotificationStateKey = 'down' | 'unreachable' | 'recovery' | 'flapping' | 'downtime';
export type ServiceNotificationStateKey = 'warning' | 'critical' | 'unknown' | 'recovery' | 'flapping' | 'downtime';
export type NotificationStateKey = HostNotificationStateKey | ServiceNotificationStateKey;

/** Only contains the states of the object type (host or service) */
export type NotificationOptions = Partial<Record<NotificationStateKey, boolean>>;

/** Host or service */
export interface NotificationPeriodObject {
    id: number;
    name: string;
    /** Only set for services */
    hostname?: string;
    notificationsEnabled: boolean;
    notificationPeriod: ResolvedTimeperiod;
    options: NotificationOptions;
}

export interface NotificationPeriodContact {
    id: number;
    name: string;
    notificationsEnabled: boolean;
    notificationPeriod: ResolvedTimeperiod;
    options: NotificationOptions;
}

/** Response of hosts/notificationsOverview */
export interface HostNotificationPeriodOverviewResponse {
    host: NotificationPeriodObject;
    contacts: NotificationPeriodContact[];
}

/** Response of services/notificationsOverview */
export interface ServiceNotificationPeriodOverviewResponse {
    service: NotificationPeriodObject;
    contacts: NotificationPeriodContact[];
}

/** Host and service response normalized for the component */
export interface NotificationPeriodOverviewData {
    object: NotificationPeriodObject;
    contacts: NotificationPeriodContact[];
}
