export interface ChangecalendarWidgetResponse {
    changeCalendars: {
        [key: string]: ChangeCalendarWidget
    }
    displayType: string
}

export interface ChangeCalendarWidget {
    id: number
    name: string
    description: string
    colour: string
    container_id: number
    changecalendar_events: ChangecalendarEvent[]
}

export interface ChangecalendarEvent {
    id: number
    title: string
    description: string
    start: string
    end: string
    backgroundColor: string
//    uid: any
//    context: any
//    created: string
//    modified: string
//    changecalendar_id: number
//    user_id: number
}

export interface ChangeCalendarWidgetPost {
    changecalendar_ids: number[]
    displayType: string
    Widget: {
        id: string
    }
}

