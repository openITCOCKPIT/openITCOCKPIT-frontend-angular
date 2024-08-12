export interface Container {
    containertype_id: number
    id: number
    lft: number
    name: string
    parent_id: number
    rght: number
}

export interface ContainerWithHostJoinData extends Container {
    id: number
    host_id: number
    container_id: number
}

export interface ContainerWithContactJoinData extends Container {
    id: number
    contact_id: number
    container_id: number
}

/**********************
 *     Global action    *
 **********************/

export interface ContainersLoadContainersByStringParams {
    'angular': true,
    'filter[Containers.name]': string,
    onlyWritePermissions?: true
}
