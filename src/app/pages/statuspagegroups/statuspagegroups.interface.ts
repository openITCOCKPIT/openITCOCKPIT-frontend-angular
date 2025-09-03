export interface StatuspagegroupsInterface {
}

export interface StatuspagegroupPost {
    id?: number
    container_id: number
    name: string
    description: string
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
    description: string
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
    id?: number
    name: string
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
