export interface TimeperiodRoot {
    timeperiod: Timeperiod
    _csrfToken: string
}

export interface Timeperiod {
    id: number
    uuid: string
    container_id: number
    name: string
    description: string
    calendar_id: number
    created: string
    modified: string
    timeperiod_timeranges: TimeperiodTimerange[]
    events: Event[]
}

export interface TimeperiodTimerange {
    id: number
    timeperiod_id: number
    day: number
    start: string
    end: string
}

export interface Event {
    daysOfWeek: number[]
    startTime?: string
    endTime?: string
    title?: string
    display?: string
    className?: string
    allDay?: boolean
    overLap?: boolean
}

export interface TimeRange {
    start: string
    end: string
}

export interface WeekDays {
    [key: number]: TimeRange[]
}
