export interface ChartAbsolutValue {
    Total: number // G - basic value
    Value: number // W
    // % = Value / Total * 100
}

export interface PieChartMetric {
    name: string
    value: number
}
