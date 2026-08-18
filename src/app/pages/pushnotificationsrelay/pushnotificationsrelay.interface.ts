export interface RelayPost {
    address: string,
    port: number,
    auth_key: string,
    enabled: boolean,
    id?: number
}

export interface PushrelayRegisterAndTestResult {
    result: {
        error: boolean,
        status: number,
        reason_phrase: string,
        response_msg: string,
        system: undefined | null | {
            auth_key: string,
            system_id: string,
            created: string,
            modified: string,
        }
    }
    _csrfToken: string | null
}
