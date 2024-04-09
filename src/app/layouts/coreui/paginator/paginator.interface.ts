export interface PaginateOrScroll {
  scroll?: Scroll,
  paging?: Paging
}

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

// This event will be thrown when the paginator or scroll index component changes the page
// Or when the mode will be changed from scroll to page or vice versa
export interface PaginatorChangeEvent {
  page: number, // the new page to load
  scroll: boolean // true = scroll mode, false = page mode
}

