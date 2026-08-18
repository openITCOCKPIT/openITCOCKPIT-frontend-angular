import { IPoint } from '@foblex/2d';
import { HoststatusObject } from '../../../pages/hosts/hosts.interface';

export interface INode {
    id: string
    position: IPoint
    connectorId: string
    nodeData?: NodeData
}

export interface NodeData {
    id: number
    name: string
    parentIds?: number[] | null
    hoststatus?: HoststatusObject
    groupId?: string | undefined
    is_satellite_host?: boolean
    isAcknowledged?: boolean
    isInDowntime?: boolean
    isGroup: boolean
}

export interface HostParentsChildrenTree {
    [key: string]: NodeData
}

export interface ConnectionOperator {
    id: string
    from: string
    to: string
}
