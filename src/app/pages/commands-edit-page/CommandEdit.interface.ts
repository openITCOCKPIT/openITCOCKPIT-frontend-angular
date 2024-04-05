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
