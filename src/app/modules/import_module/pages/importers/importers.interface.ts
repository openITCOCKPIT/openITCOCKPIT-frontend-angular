import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { Hostdefault } from '../hostdefaults/hostdefaults.interface';
import {
    ExternalMonitoringConfigIcinga2, ExternalMonitoringConfigOpmanager, ExternalMonitoringConfigPrtg,
    ExternalMonitoringsAsList
} from '../externalmonitorings/external-monitorings.interface';
import { ExternalSystemsAsList } from '../externalsystems/external-systems.interface';
import { DynamicalFormFields } from '../../../../components/dynamical-form-fields/dynamical-form-fields.interface';

export interface ImportersIndexRoot extends PaginateOrScroll {
    importers: Importer[]
    _csrfToken: string
}

export interface Importer {
    id: number
    name: string
    container_id: number
    description: string
    hostdefault_id: number
    container: string
    allowEdit: boolean
}

export interface ImportersIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Importers.id][]': [],
    'filter[Importers.name]': string
    'filter[Importers.description]': string
}

export function getDefaultImportersIndexParams(): ImportersIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Importers.name',
        page: 1,
        direction: 'asc',
        'filter[Importers.id][]': [],
        'filter[Importers.name]': '',
        'filter[Importers.description]': ''
    }
}

export interface ImportersIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Importers.id][]': [],
    'filter[Importers.name]': string
    'filter[Importers.description]': string
}


export interface ImportersGet {
    importer: ImportersPost
}


export interface ImportersPost {
    id?: number
    container_id: number | null
    name: string
    description: string
    data_source: string
    hostname_regex: string
    allow_empty_hosts: number
    disable_updates: number // only create new hosts
    force_disable_hosts: number // hosts
    re_enable_hosts: number // hosts
    force_delete: number // services
    keep_container_settings: number
    keep_satellite_settings: number
    config: {}
    hostdefault_id: number
    external_system_id: number | null
    external_monitorings: {
        _ids: number[]
    }
}

export interface ImporterElements {
    hostdefaults: Hostdefault[]
    externalsystems: ExternalSystemsAsList
    externalMonitorings: ExternalMonitoringsAsList
}

export interface ImporterConfig {
    config: {
        config: {}
        formFields: DynamicalFormFields
    }
}
