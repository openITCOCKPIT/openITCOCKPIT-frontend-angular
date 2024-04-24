/**********************
 *    Index action    *
 **********************/
import { CommandTypesEnum } from './command-types.enum';
import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { GenericValidationError } from '../../generic-responses';

export interface CommandsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: string, // asc or desc
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
