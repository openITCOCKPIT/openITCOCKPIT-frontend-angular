export interface PushConfigurationRoot {
    websocket: {
        [key: string]: string
    }
    user: PushConfigurationUser
}

export interface PushConfigurationUser {
    id: number
    hasPushContact: boolean
}
