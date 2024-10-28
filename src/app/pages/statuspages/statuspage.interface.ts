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

export interface StatuspagePost {
    container_id: null | number,
    name: '',
    description: '',
    public: 0,
    show_downtimes: 0,
    show_downtime_comments: 0,
    show_acknowledgements: 0,
    show_acknowledgement_comments: 0,
    selected_hostgroups: {
        _ids: number[]
    },
    selected_hosts: {
        _ids: number[]
    },
    selected_servicegroups: {
        _ids: number[]
    },
    selected_services: {
        _ids: number[]
    },
    hostgroups: {},
    hosts: {},
    servicegroups: {},
    services: {},
}

export interface SelectKeyValueExtended {
    key: number,
    value: string | {},
    id?: number,
    _joinData: {
        display_alias?: ''
    }
}



