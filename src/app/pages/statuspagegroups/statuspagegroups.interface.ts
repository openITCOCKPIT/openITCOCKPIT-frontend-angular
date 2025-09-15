import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { CumulatedStatuspagegroupStatus } from './cumulated-statuspagegroup-status.enum';

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
    statuspages_memberships: StatuspagesMembershipPost[]
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
    cumulatedCollectionState?: number // only in view
}

export interface StatuspagegroupCategoryPost {
    id?: number
    statuspagegroup_id?: number
    name: string
    modified?: string
    created?: string
    cumulatedCategoryState?: number // only in view
}

export interface StatuspagesMembershipPost {
    id?: number
    statuspagegroup_id?: number
    collection_id?: number
    category_id?: number
    statuspage_id: number
    modified?: string
    created?: string
}

export interface StatuspageMatrixItem {
    collectionIndex: number  // index position in collections array
    collectionId: number     // actual database ID of the collection
    categoryIndex: number    // index position in categories array
    categoryId: number       // actual database ID of the category
    statuspageIds: number[]  // IDs of status pages assigned to this cell
}

export interface StatupagegroupViewRoot {
    statuspagegroup: StatuspagegroupPost
    statuspages: StatuspageView[]
    cumulatedStategroupState: CumulatedStatuspagegroupStatus
    matrix: StatuspageMatrixViewItem[][]
    problems: StatupagegroupProblem[]
    _csrfToken: string
}

export interface StatuspageMatrixViewItem {
    collectionIndex: number  // index position in collections array
    collectionId: number     // actual database ID of the collection
    categoryIndex: number    // index position in categories array
    categoryId: number       // actual database ID of the category
    statuspageIds: number[]  // IDs of status pages assigned to this cell
    cumulatedStates: CumulatedStatuspagegroupStatus[] // All the cumulated states of the statuspages in this cell
    cumulatedState: CumulatedStatuspagegroupStatus // The overall cumulated state of this cell (worst state of all statuspages in this cell)
    statuspages: StatuspageView[]
    total_statuspages: number
    total_not_monitored: number
    total_ok: number
    total_warning: number
    total_critical: number
    total_unknown: number
}

export interface StatuspageView {
    statuspage: {
        id: number
        uuid: string
        container_id: number
        name: string
        description: string
        public_title: string
        public_identifier: null | string
        public: boolean
    }
    cumulatedState: CumulatedStatuspagegroupStatus
    host_acknowledgements: number
    host_downtimes: number
    host_total: number
    host_problems: number
    service_acknowledgements: number
    service_downtimes: number
    service_total: number
    service_problems: number
}

export interface StatupagegroupProblem {
    statuspage: StatuspageView
    collection: {
        id: number
        statuspagegroup_id: number
        name: string
        description: string | null
        modified: string
        created: string
    }
    category: {
        id: number
        statuspagegroup_id: number
        name: string
        modified: string
        created: string
    }
    cumulatedState: CumulatedStatuspagegroupStatus
}
