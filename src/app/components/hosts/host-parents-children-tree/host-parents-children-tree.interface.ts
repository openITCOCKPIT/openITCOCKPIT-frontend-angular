import { IPoint } from '@foblex/2d';
import { HoststatusObject } from '../../../pages/hosts/hosts.interface';

export interface INode {
    id: string
    position: IPoint
    connectorId: string
    hostNode: HostNode
}

export interface HostNode {
    id: string
    name: string
    parentIds: string[] | null
    hoststatus: HoststatusObject
}

export interface HostParentsChildrenTreeItem {
    id: number | string
    name: string
    hoststatus: HoststatusObject
    isChildOfHost?: boolean
    parent_ids: number[]
}

export interface ConnectionOperator {
    id: string
    from: string
    to: string
}
