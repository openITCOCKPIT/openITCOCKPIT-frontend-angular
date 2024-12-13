export interface MapItemPosition {
    x: number;
    y: number;
}

export interface Mapitem {
    id: number
    map_id: number
    x: number
    y: number
    limit?: any
    iconset?: string
    type?: string
    object_id?: number
    z_index?: string
    show_label?: boolean
    label_possition?: number
    display?: boolean
}

export interface ContextAction {
    type: string
    data: Mapitem
}
