export interface WelcomeWidgetResponse {
    isCommunityEdition: boolean
    hasSubscription: boolean
    server_timezone: string
    user_timezone: string
    userImage: string
    user_fullname: string
    OPENITCOCKPIT_VERSION: string
    _csrfToken: string
}

export interface TodayWidgetResponse {
    dateDetails: {
        dayNumber: number
        weekday: string
        monthName: string
        start: string
        end: string
        today_timestamp: number
        yesterday_timestamp: number
        start_timestamp: number
        end_timestamp: number
    }
    _csrfToken: string
}
