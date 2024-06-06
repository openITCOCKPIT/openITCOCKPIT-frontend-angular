import { ServicetemplateTypesEnum } from './servicetemplate-types.enum';
import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { IconProp, RotateProp } from '@fortawesome/fontawesome-svg-core';

/**********************
 *    Index action    *
 **********************/
export interface ServicetemplatesIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Servicetemplates.id][]': number[],
    'filter[Servicetemplates.name]': string
    'filter[Servicetemplates.template_name]': string
    'filter[Servicetemplates.description]': string
    'filter[Servicetemplates.servicetemplatetype_id][]': ServicetemplateTypesEnum[]
}

export function getDefaultServicetemplatesIndexParams(): ServicetemplatesIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Servicetemplates.name',
        page: 1,
        direction: 'asc',
        'filter[Servicetemplates.id][]': [],
        'filter[Servicetemplates.name]': "",
        'filter[Servicetemplates.template_name]': "",
        'filter[Servicetemplates.description]': "",
        'filter[Servicetemplates.servicetemplatetype_id][]': [
            //ServicetemplateTypesEnum.GENERIC_SERVICE,
            //ServicetemplateTypesEnum.OITC_AGENT_SERVICE,
        ]
    }
}

export interface ServicetemplateIndexRoot extends PaginateOrScroll {
    all_servicetemplates: ServicetemplateIndex[]
    _csrfToken: string
}

export interface ServicetemplateIndex {
    Servicetemplate: {
        id: number
        uuid: string
        template_name: string
        name: string
        container_id: number
        servicetemplatetype_id: number
        check_period_id: number
        notify_period_id: number
        description: string
        command_id: number
        check_command_args: string
        checkcommand_info: string
        eventhandler_command_id: number
        timeperiod_id?: number
        check_interval: number
        retry_interval: number
        max_check_attempts: number
        first_notification_delay: number
        notification_interval: number
        notify_on_warning: number
        notify_on_unknown: number
        notify_on_critical: number
        notify_on_recovery: number
        notify_on_flapping: number
        notify_on_downtime: number
        flap_detection_enabled: number
        flap_detection_on_ok: number
        flap_detection_on_warning: number
        flap_detection_on_unknown: number
        flap_detection_on_critical: number
        low_flap_threshold: number
        high_flap_threshold: number
        process_performance_data: number
        freshness_checks_enabled: number
        freshness_threshold?: number
        passive_checks_enabled: number
        event_handler_enabled: number
        active_checks_enabled: number
        retain_status_information: number
        retain_nonstatus_information: number
        notifications_enabled: number
        notes: string
        priority: number
        tags: string
        service_url?: string
        sla_relevant: number
        is_volatile: number
        check_freshness: number
        created: string
        modified: string
        allow_edit: boolean
        type: ServicetemplateType
    }
}

export interface ServicetemplateType {
    title: string
    color: string
    class: string
    icon: IconProp,
    rotate: RotateProp,
}
