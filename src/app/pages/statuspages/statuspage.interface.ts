export interface StatuspageRoot {
    Statuspage: Statuspage
    _csrfToken: string
}

export interface Statuspage {
    statuspage: StatuspageProperties
    items: Item[]
}

export interface StatuspageProperties {
    name: string
    description: string
    public: boolean
    showDowntimes: boolean
    showDowntimeComments: boolean
    showAcknowledgements: boolean
    showAcknowledgementComments: boolean
    cumulatedColorId: number
    cumulatedColor: string
    cumulatedHumanStatus: string
    cumulatedIcon: string
}

export interface Item {
    type: string
    id: number
    name: string
    cumulatedStateName: string
    cumulatedColorId: number
    cumulatedColor: string
    isAcknowledge: boolean
    acknowledgeComment: string[]
    scheduledStartTime: any
    scheduledEndTime: any
    comment: any
    isInDowntime: boolean
    downtimeData: any[]
    plannedDowntimeData: PlannedDowntimeDaum[]
    acknowledgedProblemsText: string
}

export interface PlannedDowntimeDaum {
    scheduledStartTimestamp: number
    scheduledStartTime: string
    scheduledEndTime: string
    comment: string
}

export interface statuspagePost {

}


