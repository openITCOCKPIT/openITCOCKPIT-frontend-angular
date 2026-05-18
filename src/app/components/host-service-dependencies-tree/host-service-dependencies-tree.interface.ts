import { IPoint } from '@foblex/2d';
import { HostdependencyHost } from '../../pages/hostdependencies/hostdependencies.interface';

export interface HostServiceDependenciesINode {
    id: string
    position: IPoint
    connectorId: string
    dependenciesNode?: DependenciesNode
}

export interface DependenciesNode {
    id: string
    name: string
    parentIds: string[] | null
}

export interface HostServiceDependenciesTree {
    [key: string]: HostServiceDependenciesTreeItem
}

export interface HostServiceDependenciesTreeItem {
    id: number | string
    name: string
    uuid: string
    hosts_dependent: HostdependencyHost[]
    execution_fail_on_up: number
    execution_fail_on_down: number
    execution_fail_on_unreachable: number
    execution_fail_on_pending: number
    notification_fail_on_up: number
    notification_fail_on_down: number
    notification_fail_on_unreachable: number
    notification_fail_on_pending: number
    parentIds: number[]
}
