import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { DynamicalFormFields } from '../../../../components/dynamical-form-fields/dynamical-form-fields.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';

export interface ExternalMonitoringsIndexRoot extends PaginateOrScroll {
    externalMonitorings: ExternalMonitoring[]
    _csrfToken: any
}

export interface ExternalMonitoring {
    id: number
    name: string
    container_id: number
    description: string
    system_type: string
    container: string
    allowEdit: boolean
}

export interface ExternalMonitoringPost {
    id?: number
    container_id: number | null
    name: string
    description: string
    system_type: string
    json_data: any
}

export interface ExternalMonitoringGet {
    externalMonitoring: ExternalMonitoringPost
}

export interface ExternalMonitoringsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[ExternalMonitorings.id][]': [],
    'filter[ExternalMonitorings.name]': string
    'filter[ExternalMonitorings.description]': string
    'filter[ExternalMonitorings.api_url]': boolean
}

export function getDefaultExternalMonitoringsIndexParams(): ExternalMonitoringsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'ExternalMonitorings.name',
        page: 1,
        direction: 'asc',
        'filter[ExternalMonitorings.id][]': [],
        'filter[ExternalMonitorings.name]': '',
        'filter[ExternalMonitorings.description]': '',
        'filter[ExternalMonitorings.api_url]': false
    }
}

export interface ExternalMonitoringConfig {
    config: {
        config: ExternalMonitoringConfigIcinga2 | ExternalMonitoringConfigOpmanager | ExternalMonitoringConfigPrtg
        formFields: DynamicalFormFields
    }
}

export interface ExternalMonitoringConfigIcinga2 {
    api_url: string
    api_user: string
    api_password: string
    use_proxy: number
    ignore_ssl_certificate: number
    check_type: string
    receive_downtimes: number
    receive_acknowledgements: number
}

export interface ExternalMonitoringConfigOpmanager {
    api_url: string
    api_key: string
    use_proxy: number
    ignore_ssl_certificate: number
    polling_interval: number
}

export interface ExternalMonitoringConfigPrtg {
    api_url: string
    api_token: string
    api_user: string
    api_password: string
    use_proxy: number
    ignore_ssl_certificate: number
    polling_interval: number
    include_channels: number
}

export interface ExternalMonitoringsAsList{
    externalMonitorings: SelectKeyValue[]
}
