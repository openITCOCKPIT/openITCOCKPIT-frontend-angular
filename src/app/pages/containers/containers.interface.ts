export interface Container {
    containertype_id: number
    id: number
    lft: number
    name: string
    parent_id: number
    rght: number
}


/**********************
 *     Global action    *
 **********************/

export interface ContainersLoadContainersByStringParams {
    'angular': true,
    'filter[Containers.name]': string,
    onlyWritePermissions?: true
}
