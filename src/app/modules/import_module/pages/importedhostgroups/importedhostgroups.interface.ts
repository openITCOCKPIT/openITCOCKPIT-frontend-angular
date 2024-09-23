import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { Hostgroup } from '../../../../pages/hostgroups/hostgroups.interface';
import { ExternalSystemEntity } from '../../external-systems.interface';
import { Container } from '../../../../pages/containers/containers.interface';


export interface ImportedhostgroupsIndexRoot extends PaginateOrScroll {
    importedhostgroups: Importedhostgroup[]
    externalSystems: ExternalSystemEntity[]
    _csrfToken: string
}

export interface ImportedhostgroupView {
    importedhostgroup: ImportedhostgroupGet
    containerPath: string
}

export interface ImportedhostgroupGet {
    ImportedHostgroup: Importedhostgroup
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
    container?: Container
    imported_hosts?: ImportedHost[]
}

export interface ImportedHost {
    id: number
    importer_id: number
    user_id: number
    host_id: number
    identifier: string
    name: string
    description: string
    address: string
    container_id: number
    hosttemplate_id: number
    satellite_id: number
    importedfile_id: any
    flags: number
    created: string
    modified: string
    _joinData: {
        id: number
        importedhost_id: number
        importedhostgroup_id: number
    }
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
    'filter[ImportedHostgroups.imported]': boolean
    'filter[ImportedHostgroups.not_imported]': boolean,
    'filter[imported]': string | null
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
        'filter[ImportedHostgroups.imported]': false,
        'filter[ImportedHostgroups.not_imported]': false,
        'filter[imported]': ''
    }
}
