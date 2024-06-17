import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import {
    SelectItemOptionGroup,
    SelectKeyValue,
    SelectKeyValueWithDisabled
} from '../../layouts/primeng/select.interface';

export interface ServiceescalationsIndexParams {
    angular: true,
    scroll: boolean,
    page: number,
    'filter[Serviceescalations.id][]': number[],
    'filter[Serviceescalations.first_notification]': string,
    'filter[Serviceescalations.last_notification]': string,
    'filter[Serviceescalations.escalate_on_recovery]': string,
    'filter[Serviceescalations.escalate_on_warning]': string,
    'filter[Serviceescalations.escalate_on_critical]': string,
    'filter[Serviceescalations.escalate_on_unknown]': string,
    'filter[Serviceescalations.notification_interval]': string,
    'filter[Services.servicename]': string,
    'filter[ServicesExcluded.servicename]': string,
    'filter[Servicegroups.name]': string,
    'filter[ServicegroupsExcluded.name]': string
}

export function getDefaultServiceescalationsIndexParams(): ServiceescalationsIndexParams {
    return {
        angular: true,
        scroll: true,
        page: 1,
        'filter[Serviceescalations.id][]': [],
        'filter[Serviceescalations.first_notification]': '',
        'filter[Serviceescalations.last_notification]': '',
        'filter[Serviceescalations.escalate_on_recovery]': '',
        'filter[Serviceescalations.escalate_on_warning]': '',
        'filter[Serviceescalations.escalate_on_critical]': '',
        'filter[Serviceescalations.escalate_on_unknown]': '',
        'filter[Serviceescalations.notification_interval]': '',
        'filter[Services.servicename]': '',
        'filter[ServicesExcluded.servicename]': '',
        'filter[Servicegroups.name]': '',
        'filter[ServicegroupsExcluded.name]': ''
    }
}

export interface ServiceescalationIndexRoot extends PaginateOrScroll {
    all_serviceescalations: ServiceescalationIndex[]
    _csrfToken: string
}

export interface ServiceescalationIndex {
    id: number
    first_notification: string
    last_notification: string
    escalate_on_recovery: string
    escalate_on_warning: string
    escalate_on_critical: string
    escalate_on_unknown: string
    notification_interval: any
    allowEdit: boolean
    timeperiod: ServiceescalationTimeperiod
    services: ServiceescalationService[]
    services_excluded: ServiceescalationService[]
    servicegroups: ServiceescalationServicegroup[]
    servicegroups_excluded: ServiceescalationServicegroup[]
    contacts: ServiceescalationContact[]
    contactgroups: ServiceescalationContactgroup[]
}

export interface ServiceescalationServicegroup {
    id: number
    uuid: string
    container_id: number
    description: string
    servicegroup_url: any
    _joinData: ServiceescalationServicegroupJoinData
    container: ServiceescalationContainer
}

export interface ServiceescalationServicegroupJoinData {
    id: number
    servicegroup_id: number
    serviceescalation_id: number
    excluded: number
}

export interface ServiceescalationContainer {
    name: string
}

export interface ServiceescalationServicesJoinData {
    id: number
    service_id: number
    serviceescalation_id: number
    excluded: number
}

export interface ServiceescalationService {
    id: number
    servicename: string
    disabled: number
    _joinData: ServiceescalationServicesJoinData
}

export interface ServiceescalationTimeperiod {
    id: number
    name: string
}

export interface ServiceescalationContactgroup {
    id: number
    uuid: string
    container_id: number
    description: string
    _joinData: ServiceescalationContactgroupJoinData
    container: ServiceescalationContainer
}

export interface ServiceescalationContactgroupJoinData {
    id: number
    contactgroup_id: number
    serviceescalation_id: number
}


export interface ServiceescalationContact {
    id: number
    name: string
    _joinData: ServiceescalationContactJoinData
}

export interface ServiceescalationContactJoinData {
    id: number
    contact_id: number
    serviceescalation_id: number
}

export interface ServiceescalationContainerResult {
    areContainersRestricted: boolean,
    containers: SelectKeyValue[]
}

export interface ServiceescalationPost {
    id?: null | number
    container_id?: null | number
    first_notification: number
    last_notification: number
    notification_interval: number
    timeperiod_id?: null | number
    escalate_on_recovery: number
    escalate_on_warning: number
    escalate_on_critical: number
    escalate_on_unknown: number
    services: {
        _ids: number[]
    }
    services_excluded: {
        _ids: number[]
    }
    servicegroups: {
        _ids: number[]
    }
    servicegroups_excluded: {
        _ids: number[]
    }
    contacts: {
        _ids: number[]
    }
    contactgroups: {
        _ids: number[]
    }
}

export interface ServiceescalationGet {
    id?: null | number
    container_id?: null | number
    first_notification: number
    last_notification: number
    notification_interval: number
    timeperiod_id?: null | number
    escalate_on_recovery: number
    escalate_on_warning: number
    escalate_on_critical: number
    escalate_on_unknown: number
    services: ServiceescalationService[]
    services_excluded: ServiceescalationService[]
    servicegroups: ServiceescalationServicegroup[]
    servicegroups_excluded: ServiceescalationServicegroup[]
    contacts: ServiceescalationContactJoinData[]
    contactgroups: ServiceescalationContactgroupJoinData[]
}

export interface ServiceescalationElements {
    services: SelectKeyValueWithDisabled[]
    servicegroups: SelectKeyValueWithDisabled[]
    timeperiods: SelectKeyValue[]
    contacts: SelectKeyValue[]
    contactgroups: SelectKeyValue[]
}

export interface ServiceescalationServices {
    services: SelectItemOptionGroup[]
}

export interface ServiceescalationExcludedServices {
    excludedServices: SelectItemOptionGroup[]
}

export interface ServiceescalationExcludedServicegroups {
    excludedServicegroups: SelectKeyValueWithDisabled[]
}

export interface ServiceescalationEditApiResult {
    serviceescalation: ServiceescalationGet
}

export interface ServiceescalationServiceValues {
    services: ServiceescalationService[]
}

export interface ServiceescalationService {
    key: number
    value: ServiceescalationServiceValue
}

export interface ServiceescalationServiceValue {
    servicename: string
    id: number
    disabled: number
    _matchingData: ServiceescalationMatchingData
}

export interface ServiceescalationMatchingData {
    Hosts: ServiceescalationServiceHosts
}

export interface ServiceescalationServiceHosts {
    name: string
}
