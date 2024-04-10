/**********************
 *    Index action    *
 **********************/
import {CommandTypesEnum} from './command-types.enum';
import {PaginateOrScroll} from '../../layouts/coreui/paginator/paginator.interface';

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

export interface CommandIndexRoot extends PaginateOrScroll {
  all_commands: CommandIndex[]
  _csrfToken: string
}

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

/**********************
 *    Index action    *
 **********************/
export interface CommandEdit {
  id: number
  name: string
  command_line: string
  command_type: number
  human_args: any
  uuid: string
  description: string
  commandarguments: Array<{
    id: number
    command_id: number
    name: string
    human_name: string
    created: string
    modified: string
  }>
}
