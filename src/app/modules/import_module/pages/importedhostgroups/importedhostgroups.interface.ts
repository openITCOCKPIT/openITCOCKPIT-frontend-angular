import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { Hostgroup } from '../../../../pages/hostgroups/hostgroups.interface';
import { ExternalSystemEntity } from '../../ExternalSystems.interface';


export interface ImportedhostgroupsIndexRoot extends PaginateOrScroll {
    importedhostgroups: Importedhostgroup[]
    _csrfToken: string
}

export interface Importedhostgroup {
    id: number
    identifier: string
    hostgroup_id: number
    external_system_id: number
    name: string
    container_id: number
    description: string
    hostgroup_url: any
    created: string
    modified: string
    imported: number
    allowEdit: boolean
    allowView: boolean
    hostgroup?: Hostgroup
    external_system?: ExternalSystemEntity
}

export interface ImportedhostgroupsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[ImportedHostgroups.id][]': [],
    'filter[ImportedHostgroups.name]': string
    'filter[ImportedHostgroups.description]': string
    'filter[ImportedHostgroups.imported]': string
    'filter[ImportedHostgroups.not_imported]': string
}

export interface ImportedHostgroupIndex {
    id: number
    name: string
    description: string
    container_id: number
    allowEdit: boolean
}

export function getDefaultImportedHostgroupsIndexParams(): ImportedhostgroupsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'ImportedHostgroups.name',
        page: 1,
        direction: 'asc',
        'filter[ImportedHostgroups.id][]': [],
        'filter[ImportedHostgroups.name]': '',
        'filter[ImportedHostgroups.description]': '',
        'filter[ImportedHostgroups.imported]': '',
        'filter[ImportedHostgroups.not_imported]': '',
    }
}
