import { GenericIdAndName } from '../../../generic.interfaces';
import { HoststatusObject } from '../../hosts/hosts.interface';

export interface HostdependenciesTree {
    hostdependenciesTree: {
        nodes: HostTreeNode[] | DependencyTreeNode[]
        connections: HostDependencyConnection[]
    }
}


export interface DependencyTreeNode {
    id: string
    hostdependency_id: number
    uuid: string
    type: 'dependency'
    inherits_parent: number
    timeperiod: GenericIdAndName
    execution_fail_on_up: number
    execution_fail_on_down: number
    execution_fail_on_unreachable: number
    execution_fail_on_pending: number
    execution_none: number
    notification_fail_on_up: number
    notification_fail_on_down: number
    notification_fail_on_unreachable: number
    notification_fail_on_pending: number
    notification_none: number
    position?: { x: number; y: number }
}

export interface HostTreeNode {
    id: string
    uuid: string
    type: 'host'
    host_id: number
    name: string
    Hoststatus?: HoststatusObject
    position?: { x: number; y: number };
}

export interface HostDependencyConnection {
    id: string
    source: string
    target: string
}
