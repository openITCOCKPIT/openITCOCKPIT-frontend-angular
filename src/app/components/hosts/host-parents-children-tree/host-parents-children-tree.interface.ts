import { IPoint } from '@foblex/2d';
import { HoststatusObject } from '../../../pages/hosts/hosts.interface';

export interface INode {
    id: string
    position: IPoint
    connectorId: string
    hostNode?: HostNode
}

export interface HostNode {
    id: string
    name: string
    parentIds: string[] | null
    hoststatus: HoststatusObject
    groupId: string | undefined
}

export interface HostParentsChildrenTreeItem {
    id: number | string
    name: string
    hoststatus: HoststatusObject
    parent_ids: number[]
    isMainHost?: boolean
}

export interface ConnectionOperator {
    id: string
    from: string
    to: string
}
