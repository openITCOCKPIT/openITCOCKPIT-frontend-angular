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
