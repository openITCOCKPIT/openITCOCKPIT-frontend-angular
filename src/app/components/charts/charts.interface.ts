export interface ChartAbsolutValue {
    Name: string
    Total: number // G - basic value
    Value: number // W
    // % = Value / Total * 100
}

export interface PieChartMetric {
    name: string
    value: number
}

export interface SparklineBarMetric {
    name: string
    value: number,
    label?: {
        value: string | number
        icon: string
        text: string
    }
}
