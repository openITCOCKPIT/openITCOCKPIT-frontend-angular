import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';

export interface FilterBookmark {
    name: string,
    controller: string
}

export interface FilterbookmarkAllocationsIndex extends PaginateOrScroll {
    all_filterbookmark_allocations: FilterbookmarkAllocationWithUsersAndUsergroups[]
    _csrfToken: string
}

export interface FilterbookmarkAllocationWithUsersAndUsergroups {
    id?: number                   // not present when creating
    name: string
    filter_bookmark_id: number,
    filter_bookmark?: FilterBookmark,
    container_id: number
    author: string
    user_id?: number            // not present when creating
    created?: string            // not present when creating
    modified?: string           // not present when creating
    usergroups: FilterbookmarkAllocationToUsergroup[]
    users: FilterbookmarkAllocationToUser[]
}

export interface FilterbookmarkAllocationToUser {
    full_name: string
    _joinData: {
        id: number
        user_id: number
        filter_bookmark_allocation_id: number
    }
}

export interface FilterbookmarkAllocationToUsergroup {
    name: string
    _joinData: {
        id: number
        usergroup_id: number
        filter_bookmark_allocation_id: number
    }
}

export interface FilterbookmarkAllocationsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[FilterBookmarkAllocations.id][]': number[],
    'filter[FilterBookmarkAllocations.name]': string
}

export function getDefaultFilterbookmarkAllocationsIndexParams(): FilterbookmarkAllocationsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'FilterBookmarkAllocations.name',
        page: 1,
        direction: 'asc',
        'filter[FilterBookmarkAllocations.id][]': [],
        'filter[FilterBookmarkAllocations.name]': ""
    }
}


export interface FilterbookmarkAllocationGet {
    allocation: {
        FilterBookmarkAllocation: FilterbookmarkAllocationPost
    }
}


export interface FilterbookmarkAllocationPost {
    id?: number                   // not present when creating
    name: string
    filter_bookmark_id: number
    container_id: number
    usergroups: {
        _ids: number[]
    }
    users: {
        _ids: number[]
    }
}

export interface FilterBookmarkAllocationElements {
    filter_bookmarks: SelectKeyValue[]
    users: SelectKeyValue[]
    usergroups: SelectKeyValue[]
    allocated_filterbookmarks: AllocatedFilterbookmark[]
}

export interface AllocatedFilterbookmark {
    id: number
    filter_bookmark_id: number
}
