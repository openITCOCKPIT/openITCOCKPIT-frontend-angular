import { getUserDate } from '../../services/timezone.service';

/**
 * Shared types of the central report mail log (Instant Reports, Autoreports, SLA Reports, ...)
 * Backend: report_mail_log table / ReportMailLogTable::getMailLogByReport()
 */

export interface ReportMailLogParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[ReportMailLog.recipients]': string,
    'filter[ReportMailLog.has_been_sent]': '' | '0' | '1',
    'filter[from]': Date | string,
    'filter[to]': Date | string
}

export function getDefaultReportMailLogParams(): ReportMailLogParams {
    const now: Date = getUserDate();
    return {
        angular: true,
        scroll: true,
        sort: 'ReportMailLog.send_time',
        page: 1,
        direction: 'desc',
        'filter[ReportMailLog.recipients]': '',
        'filter[ReportMailLog.has_been_sent]': '',
        'filter[from]': new Date(now.getTime() - (3600 * 24 * 30 * 1000)),
        'filter[to]': new Date(now.getTime() + (3600 * 24 * 1000))
    }
}

export interface ReportMailLogRecipient {
    user_id: number | null
    name?: string | null // Snapshot of "firstname lastname" at the time of sending (missing in older entries)
    email: string
    user_exists: boolean // Set by the API: false if the user has been deleted in the meantime
}

export interface ReportMailLogEntry {
    id: number
    report_type: string
    report_id: number
    report_name: string
    container_id: number
    recipients: ReportMailLogRecipient[]
    subject: string
    has_been_sent: boolean
    message: string | null // Error message if not sent, otherwise info by which mail system the email was accepted
    report_start: string | null
    report_end: string | null
    send_time: string
    created: string
}
