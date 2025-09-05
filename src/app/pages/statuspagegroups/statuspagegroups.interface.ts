import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

export interface StatuspagegroupsIndex extends PaginateOrScroll {
    all_statuspagegroups: Statuspagegroup[]
    _csrfToken: string
}

export interface Statuspagegroup {
    id: number
    container_id: number
    name: string
    description: string | null
    created?: string
    container?: string
    modified: string
    allowEdit: boolean
    allowView: boolean
}

export interface StatuspagegroupsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Statuspagegroups.id][]': number[],
    'filter[Statuspagegroups.name]': string
    'filter[Statuspagegroups.description]': string
}


export function getStatuspagegroupsIndexParams(): StatuspagegroupsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Statuspagegroups.name',
        page: 1,
        direction: 'asc',
        'filter[Statuspagegroups.id][]': [],
        'filter[Statuspagegroups.name]': '',
        'filter[Statuspagegroups.description]': ''
    }
}

export interface StatuspagegroupPost {
    id?: number
    container_id: number
    name: string
    description: string | null
    modified?: string
    created?: string
    statuspages: StatuspagesMembershipPost[]
    statuspagegroup_collections: StatuspagegroupCollectionPost[]
    statuspagegroup_categories: StatuspagegroupCategoryPost[]
}

export interface StatuspagegroupCollectionPost {
    id?: number
    statuspagegroup_id?: number
    name: string
    description: string | null
    modified?: string
    created?: string
}

export interface StatuspagegroupCategoryPost {
    id?: number
    statuspagegroup_id?: number
    name: string
    modified?: string
    created?: string
}

export interface StatuspagesMembershipPost {
    id: number    // this is the ID of the status page
    name?: string // In edit mode, the name of the status page is not relevant
    _joinData: {
        id?: number
        statuspagegroup_id?: number
        collection_id?: number
        category_id?: number
        statuspage_id: number
        modified?: string
        created?: string
    }
}

export interface StatuspageMatrixItem {
    collectionIndex: number  // index position in collections array
    collectionId: number     // actual database ID of the collection
    categoryIndex: number    // index position in categories array
    categoryId: number       // actual database ID of the category
    statuspageIds: number[]  // IDs of status pages assigned to this cell
}
