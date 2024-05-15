import { HosttemplateTypesEnum } from './hosttemplate-types.enum';
import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

/**********************
 *    Index action    *
 **********************/
export interface HosttemplatesIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Hosttemplates.id][]': number[],
    'filter[Hosttemplates.name]': string
    'filter[Hosttemplates.hosttemplatetype_id][]': HosttemplateTypesEnum[]
}

export function getDefaultHosttemplatesIndexParams(): HosttemplatesIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Commands.name',
        page: 1,
        direction: 'asc',
        'filter[Hosttemplates.id][]': [],
        'filter[Hosttemplates.name]': "",
        'filter[Hosttemplates.hosttemplatetype_id][]': [
            HosttemplateTypesEnum.GENERIC_HOSTTEMPLATE,
            //HosttemplateTypesEnum.EVK_HOSTTEMPLATE,
            //HosttemplateTypesEnum.SLA_HOSTTEMPLATE
        ]
    }
}

export interface HosttemplateIndexRoot extends PaginateOrScroll {
    all_hosttemplates: HosttemplateIndex[]
    _csrfToken: string
}

export interface HosttemplateIndex {
    Hosttemplate: {
        id: number
        uuid: string
        name: string
        description: string
        hosttemplatetype_id: number
        command_id: number
        check_command_args: string
        eventhandler_command_id: number
        timeperiod_id: number
        check_interval: number
        retry_interval: number
        max_check_attempts: number
        first_notification_delay: number
        notification_interval: number
        notify_on_down: number
        notify_on_unreachable: number
        notify_on_recovery: number
        notify_on_flapping: number
        notify_on_downtime: number
        flap_detection_enabled: number
        flap_detection_on_up: number
        flap_detection_on_down: number
        flap_detection_on_unreachable: number
        low_flap_threshold: number
        high_flap_threshold: number
        process_performance_data: number
        freshness_checks_enabled: number
        freshness_threshold: number
        passive_checks_enabled: number
        event_handler_enabled: number
        active_checks_enabled: number
        retain_status_information: number
        retain_nonstatus_information: number
        notifications_enabled: number
        notes: string
        priority: number
        check_period_id: number
        notify_period_id: number
        tags: string
        container_id: number
        host_url: string
        sla_id?: number
        created: string
        modified: string
        allow_edit: boolean
        type: HosttemplateType
    }
}

export interface HosttemplateType {
    title: string
    color: string
    class: string
    icon: string
}
