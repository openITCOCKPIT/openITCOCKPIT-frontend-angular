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
    hoststatus?: HoststatusObject
    groupId: string | undefined
    is_satellite_host: boolean
    isAcknowledged: boolean
    isInDowntime: boolean
}

export interface HostParentsChildrenTree {
    [key: string]: HostParentsChildrenTreeItem
}

export interface HostParentsChildrenTreeItem {
    id: number | string
    name: string
    hoststatus: HoststatusObject
    parentIds: number[]
    isMainHost?: boolean
    is_satellite_host: boolean
    isAcknowledged: boolean
    isInDowntime: boolean
}

export interface ConnectionOperator {
    id: string
    from: string
    to: string
}
