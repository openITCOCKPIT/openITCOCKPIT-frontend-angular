export interface LoadUsersByContainerIdRoot {
    users: UserByContainer[]
}

export interface UserByContainer {
    key: number
    value: string
}

export interface LoadUsersByContainerIdPost{
    containerIds: number[]
}
