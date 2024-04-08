/**********************
 *    Index action    *
 **********************/
import { CommandTypesEnum } from './command-types.enum';

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

export interface CommandIndexRoot {
  all_commands: CommandIndex[]
  _csrfToken: string
  //scroll?: Scroll
  //paging?: Paging
}

export interface CommandIndex {
  id: number
  name: string
  command_line: string
  command_type: number
  human_args: any
  uuid: string
  description: string
  type: string
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
