import { MapitemBase } from '../../components/map-item-base/map-item-base.interface';

export interface MapeditorsEditRoot {
    map: MapRoot
    maxUploadLimit: MaxUploadLimit
    max_z_index: number
    layers: string[]
    config: Config
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

export interface Map {
    id: number
    name: string
    title: string
    background: string | null
    refresh_interval: number
    json_data: string
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

export interface Config {
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

export interface Perfdata {
    [key: string]: GeneratedType
}

export interface GeneratedType {
    current: string
    unit: string
    warning: string
    critical: string
    min: string
    max: string
    metric: string
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
    Service: Service
    Host: Host
    Servicetemplate: Servicetemplate
}

export interface Service {
    id: number
    name?: string
    servicename: string
    disabled: number
}

export interface Host {
    id: number
    name: string
}

export interface Servicetemplate {
    name: string
}

/********************************
 * Maps
 ********************************/

export interface MapsByStringParams {
    'angular': boolean,
    'filter[Maps.name]': string,
    'selected[]': number[],
    'excluded[]': number[]
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
    hosts: Hosts
    services: Services
    hostgroups: Hostgroups
    servicegroups: Servicegroups
}

export interface Hosts {
    browser: boolean
    index: boolean
}

export interface Services {
    browser: boolean
    index: boolean
}

export interface Hostgroups {
    extended: boolean
}

export interface Servicegroups {
    extended: boolean
}

/********************************
 * Map Summary Toaster Component
 ********************************/

export interface MapSummaryRoot {
    summary: Summary
    _csrfToken: any
}

export interface Summary {
    Host: HostSummary
    Hoststatus: HoststatusSummary
    Service: ServiceSummary
    Servicestatus: ServicestatusSummary
}

export interface HostSummary {
    id: number
    uuid: string
    hostname: string
    address: any
    description: any
    hosttemplate_id: any
    active_checks_enabled: any
    satelliteId: any
    containerId: any
    containerIds: number[]
    tags: any
    usageFlag: any
    allow_edit: boolean
    disabled: boolean
    priority: any
    notes: any
    is_satellite_host: boolean
    name: string
}

export interface HoststatusSummary {
    currentState: number
    isFlapping: any
    problemHasBeenAcknowledged: boolean
    scheduledDowntimeDepth: number
    lastCheck: string
    nextCheck: string
    activeChecksEnabled: any
    lastHardState: any
    lastHardStateChange: string
    last_state_change: string
    output: any
    long_output: any
    acknowledgement_type: any
    state_type: boolean
    flap_detection_enabled: any
    notifications_enabled: any
    current_check_attempt: any
    max_check_attempts: any
    latency: any
    last_time_up: string
    lastHardStateChangeInWords: string
    last_state_change_in_words: string
    lastCheckInWords: string
    nextCheckInWords: string
    isHardstate: boolean
    isInMonitoring: boolean
    humanState: string
    cssClass: string
    textClass: string
    outputHtml: string
}

export interface ServiceSummary {
    id: number
    uuid: string
    servicename: string
    hostname: string
    description: any
    active_checks_enabled: any
    tags: any
    host_id: number
    allow_edit: boolean
    disabled: boolean
    serviceType: number
    priority: any
}

export interface ServicestatusSummary {
    currentState: number
    lastHardState: any
    isFlapping: any
    problemHasBeenAcknowledged: boolean
    scheduledDowntimeDepth: number
    lastCheck: string
    nextCheck: string
    activeChecksEnabled: any
    lastHardStateChange: string
    last_state_change: string
    processPerformanceData: any
    state_type: boolean
    acknowledgement_type: any
    flap_detection_enabled: any
    notifications_enabled: any
    current_check_attempt: number
    output: string
    long_output: any
    perfdata: string
    latency: any
    max_check_attempts: number
    last_time_ok: string
    lastHardStateChangeInWords: string
    last_state_change_in_words: string
    lastCheckInWords: string
    nextCheckInWords: string
    isHardstate: boolean
    isInMonitoring: boolean
    humanState: string
    cssClass: string
    textClass: string
    outputHtml: string
}
