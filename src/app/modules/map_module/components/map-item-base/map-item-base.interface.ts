import { ContextActionType, MapItemType } from './map-item-base.enum';

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
    type: ContextActionType
    data: MapitemBase
    itemType: MapItemType
}

export interface MapitemBaseActionObject {
    data: MapitemBase
    action: string
    type: MapItemType
}

export interface ResizedEvent {
    id: number
    mapId: number
    itemType: MapItemType
    width: number
    height: number
}
