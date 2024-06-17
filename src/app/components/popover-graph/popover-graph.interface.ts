export interface PopoverGraphInterface {
    performance_data: PerformanceData[]
    _csrfToken: string
}

export interface PerformanceData {
    datasource: Datasource
    data: Data
}

export interface Datasource {
    ds: string
    name: string
    label: string
    metric: string
    unit: string
    act: string
    warn: string | null
    crit: string | null
    min: number | null,
    max: number | null;
}

export interface Data {
    [key: string]: number
}

export interface PerfParams {
    angular: boolean,
    host_uuid: string,
    service_uuid: string,
    start: number,
    end: number,
    jsTimestamp: number,
}

export interface Gauges {
    key: string
    displayName: string
}


