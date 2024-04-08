export interface Scroll {
  page: number
  limit: number
  offset: number
  hasPrevPage: boolean
  prevPage: number
  nextPage: number
  current: number
  hasNextPage: boolean
}

export interface Paging {
  page: number
  current: number
  count: number
  prevPage: boolean
  nextPage: boolean
  pageCount: number
  limit: number
  options: any[]
  paramType: string
  queryScope: any
}

