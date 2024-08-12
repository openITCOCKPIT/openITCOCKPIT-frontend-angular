/**********************
 *    Index action    *
 **********************/
import { CommandTypesEnum } from './command-types.enum';
import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { GenericValidationError } from '../../generic-responses';
import { DefaultMacros } from '../../components/code-mirror-container/code-mirror-container.interface';

export interface CommandsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Commands.id][]': number[],
    'filter[Commands.name]': string
    'filter[Commands.command_type][]': CommandTypesEnum[]
}

export function getDefaultCommandsIndexParams(): CommandsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Commands.name',
        page: 1,
        direction: 'asc',
        'filter[Commands.id][]': [],
        'filter[Commands.name]': "",
        'filter[Commands.command_type][]': [
            //CommandTypesEnum.CHECK_COMMAND,
            //CommandTypesEnum.HOSTCHECK_COMMAND,
            //CommandTypesEnum.NOTIFICATION_COMMAND,
            //CommandTypesEnum.EVENTHANDLER_COMMAND
        ]
    }
}

export interface CommandIndexRoot extends PaginateOrScroll {
    all_commands: CommandIndex[]
    _csrfToken: string
}

/**********************
 *    Index action    *
 **********************/

export interface CommandIndex {
    Command: {
        id: number
        name: string
        command_line: string
        command_type: number
        human_args: any
        uuid: string
        description: string
        type: string
    }
}

/***************************
 *    Add / Edit action    *
 ***************************/

export interface CommandPost {
    id?: number
    name: string
    uuid?: string
    command_type: number
    command_line: string
    description: string
    commandarguments: Commandargument[]
}

export interface CommandEditGet {
    command: CommandPost
    defaultMacros: DefaultMacros[]
}

export interface Commandargument {
    id?: number
    command_id?: number
    name: string
    human_name: string
    created?: string
    modified?: string
}

export interface ArgumentsMissmatch {
    hasMissmatch: boolean
    usedCommandLineArgs: string[],
    definedCommandArguments: string[],
    missingArgumentDefenitions: string[],
    missingArgumentUsageInCommandLine: string[]
}

/**********************
 *     Copy action    *
 **********************/

export interface CommandCopyGet {
    Command: {
        id: number
        name: string,
        command_line: string,
        description: string
    }
}

export interface CommandCopyPost {
    Source: SourceCommand
    Command: CommandCopy
    Error: GenericValidationError | null
}

export interface SourceCommand {
    id: number
    name: string
}

export interface CommandCopy {
    id?: number,
    name: string
    command_line: string
    description: string
}


export interface CommandUsedBy {
    command: CommandUsedByCommand
    objects: CommandUsedByObjects
    total: number
    _csrfToken: string
}

export interface CommandUsedByCommand {
    id: number
    name: string
    command_line: string
    command_type: number
    human_args: any
    uuid: string
    description: string
}


export interface CommandUsedByObjects {
    Contacts: CommandUsedByContact[]
    Hosttemplates: CommandUsedByHosttemplate[]
    Servicetemplates: CommandUsedByServicetemplate[]
    Hosts: CommandUsedByHost[]
    Services: CommandUsedByService[]
}

export interface CommandUsedByContact {
    id: number
    uuid: string
    name: string
    description: string
    email: string
    phone: string
    user_id: number
    host_timeperiod_id: number
    service_timeperiod_id: number
    host_notifications_enabled: number
    service_notifications_enabled: number
    notify_service_recovery: number
    notify_service_warning: number
    notify_service_unknown: number
    notify_service_critical: number
    notify_service_flapping: number
    notify_service_downtime: number
    notify_host_recovery: number
    notify_host_down: number
    notify_host_unreachable: number
    notify_host_flapping: number
    notify_host_downtime: number
    host_push_notifications_enabled: number
    service_push_notifications_enabled: number
    containers: CommandUsedByContainer[]
}

export interface CommandUsedByContainer {
    id: number
    containertype_id: number
    name: string
    parent_id: any
    lft: number
    rght: number
    _joinData: CommandUsedByJoinData
}

export interface CommandUsedByJoinData {
    id: number
    contact_id: number
    container_id: number
}

export interface CommandUsedByHosttemplate {
    id: number
    name: string
    uuid: string
}

export interface CommandUsedByServicetemplate {
    id: number
    name: string
    template_name: string
    uuid: string
}

export interface CommandUsedByHost {
    id: number
    name: string
    uuid: string
    hosts_to_containers_sharing: CommandUsedByHostsToContainersSharing[]
}

export interface CommandUsedByHostsToContainersSharing {
    id: number
    containertype_id: number
    name: string
    parent_id?: number
    lft: number
    rght: number
    _joinData: CommandUsedByJoinData
}


export interface CommandUsedByService {
    id: number
    name: string
    uuid: string
    servicename: string
    _matchingData: CommandUsedByMatchingData
}

export interface CommandUsedByMatchingData {
    Hosts: CommandUsedByHosts
    Servicetemplates: CommandUsedByServicetemplates
}

export interface CommandUsedByHosts {
    id: number
    name: string
    uuid: string
}

export interface CommandUsedByServicetemplates {
    id: number
    name: string
    uuid: string
}

/*************************
 *     Host Browser      *
 *************************/
export interface CheckCommandCake2 {
    Command: {
        id: number
        name: string
        command_line: string
        command_type: number
        human_args: any
        uuid: string
        description: string
    }
    Commandargument: {
        id: number
        command_id: number
        name: string
        human_name: string
        created: string
        modified: string
    }[]
}
