export interface ServicenowHostBrowserResult {
    settings: {
        ServicenowHostspecificSettings: ServicenowHostspecificSettings
    },
    incident: {
        ServicenowIncident: ServicenowIncident | null,
    },
    globalsettings: {
        ServicenowSettings: ServicenowSettings
    }
}

export interface ServicenowServiceBrowserResult {
    settings: {
        ServicenowServicespecificSettings: ServicenowServicespecificSettings
    },
    incident: {
        ServicenowIncident: ServicenowIncident | null,
    },
    globalsettings: {
        ServicenowSettings: ServicenowSettings
    }
}

export interface ServicenowHostspecificSettings {
    id?: number
    host_uuid: null | string
    assignment_group: null | string
    assigned_to: null | string
    business_service: null | string
    impact: number
    urgency: number
    created?: string
    modified?: string
}

export interface ServicenowServicespecificSettings {
    id?: number
    service_uuid: null | string
    assignment_group: null | string
    assigned_to: null | string
    business_service: null | string
    impact: number
    urgency: number
    created?: string
    modified?: string
}

export interface ServicenowIncident {
    id: number
    incident_id: string
    sys_id: string
    state: string
    resolution_code: string
    resolution_notes: string
    host_uuid: string
    service_uuid: string
    created: string
    modified: string
}

export interface ServicenowSettings {
    id?: number
    domain: string
    user_id?: any
    user_password?: any
    assignment_group: null | string
    assigned_to: null | string
    business_service: null | string
    impact: number
    urgency: number
    recovery_state: number
    two_way: boolean
    use_proxy: boolean
    created?: string
    modified?: string
}

export interface ServicenowSettingsIndexRoot {
    servicenowSettings: ServicenowSettings
    _csrfToken: string
}
