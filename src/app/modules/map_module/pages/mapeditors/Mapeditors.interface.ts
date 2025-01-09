import { MapitemBase } from '../../components/map-item-base/map-item-base.interface';

export interface MapeditorsEditRoot {
    map: MapRoot
    maxUploadLimit: MaxUploadLimit
    max_z_index: number
    layers: string[]
    config: Config
    _csrfToken: string
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
    background: string
    refresh_interval: number
    json_data: string
}

export interface Mapitem extends MapitemBase {
    limit?: number
    iconset: string
    type: string
    object_id: number
    show_label: boolean
    label_possition: number
}

export interface Mapline extends MapitemBase {
    limit: any
    iconset: any
    type: string
    object_id: number
    show_label: boolean
}

export interface Mapgadget {
    size_x: number
    size_y: number
    limit: number
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

export interface Mapicon extends MapitemBase {
    icon: string
}

export interface Maptext extends MapitemBase {
    text: string
    font_size: number
}

export interface Mapsummaryitem {
    id: number
    map_id: number
    x: number
    y: number
    size_x: number
    size_y: number
    limit: number
    type: string
    object_id: number
    z_index: string
    show_label: boolean
    label_possition: number
    display: boolean
}

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

export interface Background {
    image: string
}
