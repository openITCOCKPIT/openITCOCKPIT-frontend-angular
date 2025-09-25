// See OrganizationalchartJson.php for the source of data
export interface OrganizationalchartWidgetConfig {
    organizationalchart_id: null | number | string
    refresh_key?: number
}

/**********************
 *     Global action    *
 **********************/
export interface OrganizationalchartsByStringParams {
    'angular': true,
    'filter[OrganizationalCharts.name]': string,
    'selected[]': number[],
}
