import { SelectKeyValue } from '../../layouts/primeng/select.interface';

export interface BrowsersIndexResponse {
    containers: BrowsersContainer[]
    recursiveBrowser: boolean
    breadcrumbs: BrowsersBreadcrumb[]
    organizationalCharts: SelectKeyValue[]
}

export interface BrowsersContainer {
    key: number
    value: {
        id: number
        name: string
        containertype_id: number
    }
}

export interface BrowsersBreadcrumb {
    key: number
    value: string
}


// Result of the /angular/statuscount.json endpoint
export interface StatuscountResponse {
    hoststatusCount: number[]
    servicestatusCount: number[]
    hoststatusSum: number
    servicestatusSum: number
    hoststatusCountPercentage: number[]
    servicestatusCountPercentage: number[]
    unhandledHosts: number[]
    unhandledHostsSum: number
    unhandledServices: number[]
    unhandledServicesSum: number
}
