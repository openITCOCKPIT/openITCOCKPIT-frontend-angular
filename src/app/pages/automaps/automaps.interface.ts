/**********************
 *    Index action    *
 **********************/
import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { ContainerEntity } from '../containers/containers.interface';
import { GenericValidationError } from '../../generic-responses';

export interface AutomapsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Automaps.name]': string,
    'filter[Automaps.description]': string
}

export function getDefaultAutomapsIndexParams(): AutomapsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Automaps.name',
        page: 1,
        direction: 'asc',
        'filter[Automaps.name]': "",
        'filter[Automaps.description]': ""
    }
}

export interface AutomapsIndexRoot extends PaginateOrScroll {
    all_automaps: AutomapEntity[]
    _csrfToken: string
}

export interface AutomapEntity {
    id?: number
    name: string
    container_id: number
    description: string
    host_regex: string
    hostgroup_regex?: string
    service_regex: string
    show_ok: boolean
    show_warning: boolean
    show_critical: boolean
    show_unknown: boolean
    show_acknowledged: boolean
    show_downtime: boolean
    show_label: boolean
    group_by_host: boolean
    use_paginator: boolean
    font_size: string
    recursive: boolean
    created?: string
    modified?: string
    container?: ContainerEntity
    allow_edit?: boolean
}

/**********************
 *     Copy action    *
 **********************/

export interface AutomapCopyPost {
    Source: SourceAutomap
    Automap: AutomapCopy
    Error: GenericValidationError | null
}

export interface SourceAutomap {
    id: number
    name: string
}

export interface AutomapCopy {
    id?: number,
    name: string
    description: string
    host_regex: string
    hostgroup_regex: string
    service_regex: string
}

export interface AutomapsMatchingHostAndServiceCounts {
    hostCount: number,
    serviceCount: number,
    hostgroupCount: number,
    _csrfToken?: string
}
