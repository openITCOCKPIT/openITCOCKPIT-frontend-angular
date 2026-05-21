import { IPoint } from '@foblex/2d';
import { Timeperiod } from '../../pages/hostdependencies/hostdependencies.interface';
import {
    ConnectionOperator
} from '../../modules/eventcorrelation_module/pages/eventcorrelations/eventcorrelations-view/evc-tree/evc-tree.interface';

export interface HostServiceDependenciesINode {
    id: string
    position: IPoint
    connectorId: string
    dependenciesNode: HostServiceDependenciesTreeItem
}

export interface HostServiceDependenciesConnectionOperator extends ConnectionOperator {
    connectionData: ConnectionData
}

/*export interface DependenciesNode {
    id: string
    name: string
    parentIds: string[] | null
}*/

/*export interface HostServiceDependenciesTree {
    [key: string]: HostServiceDependenciesTreeItem
}*/

/*export interface HostServiceDependenciesTreeItem {
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
}*/


export interface HostServiceDependenciesTreeItem {
    id: number
    name: string
    host?: {
        id: number
        name: string
    }
    connectionData?: ConnectionData[]
}

export interface ConnectionData {
    parentIds: number[]
    dependency_id: number
    inherits_parent: number
    timeperiod_id: number | null
    execution_fail_on_up?: number
    execution_fail_on_down?: number
    execution_fail_on_unreachable?: number
    execution_fail_on_pending: number
    notification_fail_on_up?: number
    notification_fail_on_down?: number
    notification_fail_on_unreachable?: number
    notification_fail_on_pending: number
    execution_fail_on_ok?: number
    execution_fail_on_warning?: number
    execution_fail_on_critical?: number
    execution_fail_on_unknown?: number
    notification_fail_on_ok?: number
    notification_fail_on_warning?: number
    notification_fail_on_critical?: number
    notification_fail_on_unknown?: number
    timeperiod: Timeperiod | null
}
