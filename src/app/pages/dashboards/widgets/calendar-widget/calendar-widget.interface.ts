export interface CalendarResponse {
    dateDetails: CalendarDateDetails
    _csrfToken: string
}

export interface CalendarDateDetails {
    dayNumber: number
    weekday: string
    monthName: string
    start: string
    end: string
    today_timestamp: number
    yesterday_timestamp: number
    start_timestamp: number
    end_timestamp: number
    days: CalendarDay[]
    weekdayNames: {
        [key: string]: string
    }
}

export interface CalendarDay {
    cw: string
    days: CalendarDayDetails[]
}

export interface CalendarDayDetails {
    day?: number
    weekday?: number
    timestamp?: number
}
