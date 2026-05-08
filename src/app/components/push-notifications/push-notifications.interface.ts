export interface WebSocketConfigurationRoot {
    websocket: {
        "SUDO_SERVER.API_KEY": string
        "PUSH_NOTIFICATIONS.URL": string
    }
    user: {
        id: number
        hasPushContact: boolean
    }
    _csrfToken: string
}
