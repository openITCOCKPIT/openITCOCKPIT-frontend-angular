export interface MacroIndexRoot {
  all_macros: MacroIndex[]
  _csrfToken: string
}

export interface MacroIndex {
  id: number
  name: string
  value: string
  description: string
  password: number
  created: string
  modified: string
}
