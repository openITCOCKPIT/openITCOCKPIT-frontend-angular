import {
    HostForMapItem,
    HoststatusForMapItem,
    MapitemBase,
    Perfdata,
    ServiceForMapItem,
    ServicestatusForMapItem
} from '../../components/map-item-base/map-item-base.interface';
import { Map } from '../maps/maps.interface';

export interface MapeditorsEditRoot {
    map: MapRoot
    maxUploadLimit: MaxUploadLimit
    max_z_index: number
    layers: string[]
    config: MapeditorConfig
    requiredIcons: string[]
    gadgetPreviews: GadgetPreviews[]
    _csrfToken: string
}

export interface GadgetPreviews {
    name: string
    preview: string
}

export interface MapRoot {
    Map: Map
    Mapitems: Mapitem[]
    Maplines: Mapline[]
    Mapgadgets: Mapgadget[]
    Mapicons: Mapicon[]
    Maptexts: Maptext[]
    Mapsummaryitems: Mapsummaryitem[]

    [key: string]: any; // Add index signature
}

/********************************
 * Mapitems
 ********************************/

export interface Mapitem extends MapitemBase {
    limit?: number
    iconset: string
    type: string
    object_id: number
    show_label: boolean
    label_possition: number
}

export interface MapitemPost {
    Mapitem: Mapitem
    action: string
}

export interface Mapline extends MapitemBase {
    limit: any
    iconset: any
    type: string
    object_id: number
    show_label: boolean
}

export interface MaplinePost {
    Mapline: Mapline
    action: string
}

export interface Mapgadget extends MapitemBase {
    size_x: number
    size_y: number
    limit: any
    gadget: string
    type: string
    object_id: number
    transparent_background: boolean
    show_label: boolean
    font_size: number
    metric: any
    output_type: any
    label_possition: any
}

export interface MapgadgetPost {
    Mapgadget: Mapgadget
    action: string
}


export interface Mapicon extends MapitemBase {
    icon: string
}

export interface MapiconPost {
    Mapicon: Mapicon
    action: string
}

export interface Maptext extends MapitemBase {
    text: string
    font_size: number
}

export interface MaptextPost {
    Maptext: Maptext
    action: string
}

export interface Mapsummaryitem extends MapitemBase {
    size_x: number
    size_y: number
    limit: number
    type: string
    object_id: number
    show_label: boolean
    label_possition: number
}

export interface MapsummaryitemPost {
    Mapsummaryitem: Mapsummaryitem
    action: string
}

/********************************
 * Editor
 ********************************/

export interface MaxUploadLimit {
    value: number
    unit: string
    string: string
}

export interface MapeditorConfig {
    Mapeditor: Mapeditor
}

export interface Mapeditor {
    synchronizeGridAndHelplinesSize: boolean
    grid: Grid
    helplines: Helplines
}

export interface MapeditorSettingsPost {
    Map: {
        id: string
    }
    Mapeditor: Mapeditor
}

export interface Grid {
    enabled: boolean
    size: number
}

export interface Helplines {
    enabled: boolean
    size: number
}

export interface VisibleLayers {
    [key: string]: boolean;
}

/********************************
 * Services
 ********************************/

export interface MapItemMultiItem {
    objectId: number;
    mapId: number;
    type: string;
    uuid: string;
}

export interface MapItemMultiPost {
    items: MapItemMultiItem[];
    disableGlobalLoader: boolean;
}

/********************************
 * Background
 ********************************/

export interface BackgroundImagesRoot {
    backgrounds: Background[]
    _csrfToken: string
}

export interface Background {
    image: string
    path?: string
    thumbnail?: string
}

export interface SaveBackgroundPost {
    'Map': {
        id: string
        background: string
    }
}

/********************************
 * Icons
 ********************************/

export interface IconsetRoot {
    iconsets: Iconset[]
    _csrfToken: string
}

export interface Iconset {
    [key: string]: MapUpload
}

export interface MapUpload {
    id: number
    upload_type: number
    upload_name: string
    saved_name: string
    user_id: any
    container_id: number
    created?: string
}

export interface IconsRoot {
    icons: string[]
    _csrfToken: string
}

/********************************
 * Metrics
 ********************************/

export interface PerformanceDataMetricsRoot {
    perfdata: Perfdata
    _csrfToken: string
}

/********************************
 * Services
 ********************************/

export interface ServicesByStringParams {
    'angular': boolean,
    'filter[servicename]': string,
    'selected[]': number[],
    'includeDisabled': boolean
}

export interface ServicesByStringRoot {
    services: ServicesByString[]
    _csrfToken: string
}

export interface ServicesByString {
    key: number
    value: Value
}

export interface Value {
    Service: ServiceForMapeditor
    Host: HostForMapeditor
    Servicetemplate: ServicetemplateForMapeditor
}

export interface ServiceForMapeditor {
    id: number
    name?: string
    servicename: string
    disabled: number
}

export interface HostForMapeditor {
    id: number
    name: string
}

export interface ServicetemplateForMapeditor {
    name: string
}

/********************************
 * Maps
 ********************************/

export interface MapsByStringParams {
    'angular': boolean,
    'filter[Maps.name]': string,
    'selected[]': number[],
    'excluded[]'?: number[]
}

export interface MapsByStringRoot {
    maps: MapsByStringMap[]
    _csrfToken: string
}

export interface MapsByStringMap {
    key: number
    value: string
}

/********************************
 * Mapeditors View
 ********************************/

export interface MapDetailsRoot {
    map: MapeditorsViewMap
    _csrfToken: string
}

export interface MapeditorsViewMap {
    Map: Map
}

/********************************
 * Map View Component
 ********************************/

export interface MapeditorsViewRoot {
    map: MapRoot
    ACL: Acl
    _csrfToken: string
}

export interface Acl {
    hosts: HostsForAcl
    services: ServicesForAcl
    hostgroups: HostgroupsForAcl
    servicegroups: ServicegroupsForAcl
}

export interface HostsForAcl {
    browser: boolean
    index: boolean
}

export interface ServicesForAcl {
    browser: boolean
    index: boolean
}

export interface HostgroupsForAcl {
    extended: boolean
}

export interface ServicegroupsForAcl {
    extended: boolean
}

/********************************
 * Map Summary Toaster Component
 ********************************/

export interface MapSummaryRoot {
    summary: Summary
    _csrfToken: string
}

export interface Summary {
    Map: Map
    Host: HostForMapItem
    Hosts: HostForSummaryRoot[]
    Hoststatus: HoststatusForMapItem
    Hostgroup: HostgroupForSummary
    HostSummary: HostSummary
    HostIdsGroupByState: number[][]
    NotOkHosts: any[]
    Service: ServiceForMapItem
    Services: ServicesForSummaryRoot[]
    Servicestatus: ServicestatusForMapItem
    Servicegroup: ServicegroupForSummary
    ServiceSummary: ServiceSummary
    ServiceIdsGroupByState: number[][]
    NotOkServices: any[]
    CumulatedHumanState: string
}

export interface ServicesForSummaryRoot {
    Service: ServiceForMapItem
    Servicestatus: ServicestatusForMapItem
    Host: HostForMapItem
}

export interface HostForSummaryRoot {
    Host: HostForMapItem
    Hoststatus: HoststatusForMapItem
    ServiceSummary: ServiceSummary
    ServiceIdsGroupByState: number[][]
}

export interface HostSummary {
    state: number[]
    acknowledged: number[]
    in_downtime: number[]
    not_handled: number[]
    total: number
}

export interface ServiceSummary {
    state: number[]
    total: number
}

export interface ServicegroupForSummary {
    id: number
    name: string
    description: string
}

export interface HostgroupForSummary {
    id: number
    name: string
    description: string
    HostSummary: HostSummary
    TotalServiceSummary: TotalServiceSummary
}

export interface TotalServiceSummary {
    state: number[]
    total: number
}
