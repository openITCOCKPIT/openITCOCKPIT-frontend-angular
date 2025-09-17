// See OrganizationalchartJson.php for the source of data
export interface OrganizationalchartWidgetConfig {
    organizationalchart_id: null | number | string
    refresh_key?: number
}

export interface OrganizationalchartsViewParams {
    angular: true
}

/**********************
 *     Global action    *
 **********************/
export interface OrganizationalchartsByStringParams {
    'angular': true,
    'filter[Organizationalcharts.name]': string,
    'selected[]': number[],
}

export interface OrganizationalchartsLoadOrganizationalchartsByStringParams {
    'angular': true,
    'filter[Organizationalcharts.name]': string,
    'selected[]': number[],
}

export interface OrganizationalchartsViewRoot {

}
