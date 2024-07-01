import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

export interface SnmpttEntryIndexRoot extends PaginateOrScroll {
    snmptt_entries: SnmpttEntry[]
    _csrfToken: string
}

export interface SnmpttEntry {
    Snmptt: Snmptt
}

export interface Snmptt {
    id: number
    eventname: string
    eventid: string
    trapoid: string
    enterprise: string
    community: string
    hostname: string
    agentip: string
    category: string
    severity: string | number
    uptime: string
    traptime: string
    formatline: string
    trapread: number
}

export interface SnmpttEntryIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Snmptt.eventname]': '',
    'filter[Snmptt.eventid]': '',
    'filter[Snmptt.trapoid]': '',
    'filter[Snmptt.hostname]': '',
    'filter[Snmptt.agentip]': '',
    'filter[Snmptt.severity]': '',
    'filter[Snmptt.formatline]': ''
}

export function getDefaultSnmpttEntryIndexParams(): SnmpttEntryIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Snmptt.id',
        page: 1,
        direction: 'desc',
        'filter[Snmptt.eventname]': '',
        'filter[Snmptt.eventid]': '',
        'filter[Snmptt.trapoid]': '',
        'filter[Snmptt.hostname]': '',
        'filter[Snmptt.agentip]': '',
        'filter[Snmptt.severity]': '',
        'filter[Snmptt.formatline]': ''
    }
}
