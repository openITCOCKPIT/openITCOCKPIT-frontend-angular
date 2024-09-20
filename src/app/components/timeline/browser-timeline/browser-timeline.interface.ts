import { DataItem, TimelineGroup } from "vis-timeline/peer";


export interface BrowserTimelineApiResult {
    start: number
    end: number
    groups: TimelineGroup[]
    statehistory: DataItem[]
    servicestatehistory?: DataItem[]
    downtimes: DataItem[]
    notifications: DataItem[]
    acknowledgements: DataItem[]
    timeranges: DataItem[]
}

// Based on https://visjs.github.io/vis-timeline/docs/timeline/#Events
export interface VisTimelineRangechangedProperties {
    start: Date,
    end: Date,
    byUser: boolean,
    event: Event
}
