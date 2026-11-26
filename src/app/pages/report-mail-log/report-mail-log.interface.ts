import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { getUserDate } from '../../services/timezone.service';
import { ReportMailLogRecipient } from '../../components/report-mail-log/report-mail-log.interface';

/**********************
 *    Index action    *
 **********************/
export interface ReportMailLogIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[ReportMailLog.report_name]': string,
    'filter[ReportMailLog.report_type][]': string[],
    'filter[from]': Date | string,
    'filter[to]': Date | string
}

export function getDefaultReportMailLogIndexParams(): ReportMailLogIndexParams {
    const now: Date = getUserDate();
    return {
        angular: true,
        scroll: true,
        sort: 'ReportMailLog.send_time',
        page: 1,
        direction: 'desc',
        'filter[ReportMailLog.report_name]': '',
        'filter[ReportMailLog.report_type][]': [],
        'filter[from]': new Date(now.getTime() - (3600 * 24 * 30 * 1000)),
        'filter[to]': new Date(now.getTime() + (3600 * 24 * 1000))
    }
}

export interface ReportMailLogIndexRoot extends PaginateOrScroll {
    mailLog: ReportMailLogIndexEntry[]
    reportTypes: ReportMailLogType[] // Only report types of installed modules
    _csrfToken: any
}

export interface ReportMailLogType {
    key: string // instantreport, autoreport, sla
    name: string // Translated name
}

export interface ReportMailLogIndexEntry {
    id: number
    report_type: string
    report_type_name: string
    report_id: number
    report_name: string
    container_id: number
    recipients: ReportMailLogRecipient[]
    subject: string
    has_been_sent: boolean
    message: string | null // Error message if not sent (older entries may contain an info text for sent emails)
    send_time: string
    report_exists: boolean // false if the report has been deleted in the meantime
    allowEdit: boolean // Report exists and the user has write permissions to its container
}

/**
 * Edit pages of the reports, used to link the report name in the log.
 * The link is only shown if the user has the permission (module installed and ACL).
 */
export const REPORT_MAIL_LOG_EDIT_ROUTES: { [reportType: string]: { route: string, permission: string } } = {
    instantreport: {
        route: '/instantreports/edit',
        permission: 'instantreports.edit'
    },
    autoreport: {
        route: '/autoreport_module/autoreports/editStepOne',
        permission: 'autoreportmodule.autoreports.edit'
    },
    sla: {
        route: '/sla_module/slas/edit',
        permission: 'slamodule.slas.edit'
    }
};
