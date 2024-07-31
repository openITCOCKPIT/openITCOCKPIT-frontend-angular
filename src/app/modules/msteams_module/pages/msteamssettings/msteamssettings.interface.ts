export interface MsteamssettingsPostResponse {
    teamsSettings: TeamsSettings
}

export interface MsteamssettingsGetResponse {
    teamsSettings: TeamsSettings
}

export interface TeamsSettings {
    id: number
    webhook_url: string
    two_way: boolean
    use_proxy: boolean
    created: string
    modified: string
}
