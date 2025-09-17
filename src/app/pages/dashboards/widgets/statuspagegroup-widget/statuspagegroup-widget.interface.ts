// See StatuspagegroupJson.php for the source of data
export interface StatuspagegroupWidgetConfig {
    statuspagegroup_id: null | number | string
    refresh_key?: number
}

export interface StatuspagegroupsViewParams {
    angular: true
}

/**********************
 *     Global action    *
 **********************/
export interface StatuspagegroupsByStringParams {
    'angular': true,
    'filter[Statuspagegroups.name]': string,
    'selected[]': number[],
}

export interface StatuspagegroupsLoadStatuspagegroupsByStringParams {
    'angular': true,
    'filter[Statuspagegroups.name]': string,
    'selected[]': number[],
}


export interface StatupagegroupsViewRoot {
}

export interface StatupagegroupsViewParams {

}

export interface StatuspagegroupsViewRoot {

}
