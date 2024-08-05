export interface PaginateOrScroll {
    scroll?: Scroll,
    paging?: Paging
}

export interface Scroll {
    page: number          // Current page
    limit: number         // Amount of items per page
    offset: number        // Offset of database records to skip
    hasPrevPage: boolean  // Is there a previous page
    prevPage: number      // Previous page number
    nextPage: number      // Next page number
    current: number       // Current page
    hasNextPage: boolean  // Is there a next page
}

export interface PaginatedRequest {
    angular: boolean
    direction: string
    page: number
    scroll: boolean
    sort: string
}

export interface Paging {
    page: number        // Current page
    current: number     // Current amount of items
    count: number       // Total amount of items
    prevPage: boolean   // Is there a previous page
    nextPage: boolean   // Is there a next page
    pageCount: number   // Total amount of pages
    limit: number       // Amount of items per page
    options: any[]      // Unknown
    paramType: string   // Unknown
    queryScope: any     // Unknown
}

// This event will be thrown when the paginator or scroll index component changes the page
// Or when the mode will be changed from scroll to page or vice versa
export interface PaginatorChangeEvent {
    page: number, // the new page to load
    scroll: boolean // true = scroll mode, false = page mode
}

