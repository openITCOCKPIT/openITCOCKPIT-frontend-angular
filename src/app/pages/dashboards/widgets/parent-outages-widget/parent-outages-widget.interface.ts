import { HoststatusObject } from '../../../hosts/hosts.interface';

export interface ParentOutagesResponse {
    parent_outages: ParentOutage[]
    _csrfToken: string
}

export interface ParentOutage {
    id: number
    uuid: string
    name: string
    Hoststatus: HoststatusObject
}
