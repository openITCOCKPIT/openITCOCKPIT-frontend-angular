import { ScaleTypes } from './scale-types';

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
    max: number | null,
    setup: {
        metric: {
            value: number,
            unit: string,
            name: ScaleTypes
        },
        scale: {
            min: number | null,
            max: number | null,
            type: string,
        }
        warn: {
            low: null | number,
            high: null | number,
        }
        crit: {
            low: null | number,
            high: null | number,
        }
    }
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
    jsTimestamp: number, // 1 or 0 // if 1 set isoTimestamp to 0
    isoTimestamp?: number, // 1 or 0 // if 1 set jsTimestamp to 0
}

export interface ServiceBrowserPerfParams extends PerfParams {
    aggregation: 'min' | 'max' | 'avg',
    gauge: string, // rta
    hours?: number,
    scale?: boolean,
    forcedUnit?: string,
    debug?: boolean,
    disableGlobalLoader?: boolean,
}

export interface Gauges {
    key: string
    displayName: string
}


