export interface Usertimezone {
    timezone: TimezoneObject
    _csrfToken: string
}

export interface TimezoneObject {
    user_timezone: string
    user_time_to_server_offset: number
    user_offset: number
    server_time_utc: number
    server_time: string
    server_timezone_offset: number
    server_time_iso: string
    server_timezone: string
}