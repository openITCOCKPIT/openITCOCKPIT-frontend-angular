export interface SystemdowntimesHostPost {
    id?: null | number
    is_recurring: number
    weekdays: {}
    day_of_month?: string
    from_date: Date|string
    from_time: Date|string
    to_date: Date|string
    to_time: Date|string
    duration: number
    downtime_type: string
    downtimetype_id: number|string
    objecttype_id: number
    object_id: number[]
    comment: string
    is_recursive: number
}

export interface SystemdowntimesHostGet {
    defaultValues:{
        js_from: string
        js_to: string
        from_date: string
        from_time: string
        to_date: string
        to_time: string
        duration: number
        comment: string
        downtimetype_id: string
        object_id: number[]
    }

}
