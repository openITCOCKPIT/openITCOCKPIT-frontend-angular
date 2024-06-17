export interface DowntimeObject {
    authorName: string
    commentData: string
    entryTime: string
    scheduledStartTime: string
    scheduledEndTime: string
    actualEndTime: string
    duration: number
    wasStarted: boolean
    internalDowntimeId: number
    downtimehistoryId?: number
    wasCancelled: boolean
    allowEdit: boolean
    durationHuman: string
    isCancellable: boolean
    isRunning: boolean
    isExpired: boolean
}
