export interface MapitemBase {
    id: number
    map_id: number
    x: number
    y: number
    z_index?: string
    display?: boolean
    startX?: number
    startY?: number
    endX?: number
    endY?: number
}

export interface ContextAction {
    type: string
    data: MapitemBase
}

export interface MapitemBaseActionObject {
    data: MapitemBase
    action: string
    type: string
}
