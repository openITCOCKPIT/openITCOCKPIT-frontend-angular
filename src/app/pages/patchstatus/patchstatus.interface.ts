import { PatchstatusOsTypeEnum } from './PatchstatusOsType.enum';
import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';


export interface PatchstatusIndexParams {
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Hosts.name]': string
    'filter[PackagesHostDetails.reboot_required]': string
    'filter[PackagesHostDetails.available_updates]': number | string
    'filter[PackagesHostDetails.available_security_updates]': number | string
    'filter[PackagesHostDetails.os_name]': string
    'filter[PackagesHostDetails.os_version]': string
    'filter[PackagesHostDetails.os_type][]': PatchstatusOsTypeEnum[]
}

export function getDefaultPatchstatusIndexParams(): PatchstatusIndexParams {
    return {
        scroll: true,
        sort: 'Hosts.name',
        page: 1,
        direction: 'asc',
        'filter[Hosts.name]': '',
        'filter[PackagesHostDetails.reboot_required]': '',
        'filter[PackagesHostDetails.available_updates]': 0,
        'filter[PackagesHostDetails.available_security_updates]': '',
        'filter[PackagesHostDetails.os_name]': '',
        'filter[PackagesHostDetails.os_version]': '',
        'filter[PackagesHostDetails.os_type][]': []
    }
}

export interface PatchstatusIndexRoot extends PaginateOrScroll {
    all_patchstatus: Patchstatus[]
    summary: PatchstatusSummary
    _csrfToken: string
}

export interface Patchstatus {
    id: number
    host_id: number
    os_type: string
    os_name: string
    os_version: string
    os_family: string
    agent_version: string
    reboot_required: boolean
    system_uptime: number
    uptime_in_words: string // update in words
    last_update: string
    last_update_user: string // user formatted
    available_updates: number
    available_security_updates: number
    last_error: null | string
    created: string
    modified: string
    host: {
        id: number
        name: string
        uuid: string
        container_id: number
    }
}

export interface PatchstatusSummary {
    totalHosts: number
    linuxHosts: number
    windowsHosts: number
    macosHosts: number
    totalRebootRequired: number
    linuxRebootRequired: number
    windowsRebootRequired: number
    macosRebootRequired: number
}
