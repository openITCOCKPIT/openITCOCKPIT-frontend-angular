export interface MapItemPosition {
    x: number;
    y: number;
}

export interface MapitemBase {
    id: number
    map_id: number
    x: number
    y: number
    limit?: any
    iconset?: string
    type?: string
    object_id?: number
    z_index?: string
    display?: boolean
}

export interface ContextAction {
    type: string
    data: MapitemBase
}
