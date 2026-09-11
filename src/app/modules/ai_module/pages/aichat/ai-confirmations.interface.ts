export interface AiConfirmationsIndex {
    pending_confirmations: AiPendingConfirmationRow[]
    may_confirm: boolean
    _csrfToken: string
}

export interface AiPendingConfirmationRow {
    id: number
    tool_name: string
    tool_title: string | null
    // The literal call that will be made, pretty printed. Shown verbatim in a
    // code block: what somebody approves has to be exactly what runs.
    arguments_pretty: string
    destructive: boolean
    expires_at: string
    session_id: number
    agent_name: string | null
}
