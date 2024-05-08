export interface LoadContainersRoot {
    containers: Container[]
    _csrfToken: string
}
export interface Container {
    key: number
    value: string
}
