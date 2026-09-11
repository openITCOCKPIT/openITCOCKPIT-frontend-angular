export interface AiSettings {
    id: number
    poll_interval_seconds: number
    // How long a running turn may go without a heartbeat before the reaper
    // takes it back.
    turn_timeout_seconds: number
    max_attempts: number
    // 0 keeps everything.
    session_retention_days: number
    audit_retention_days: number
    default_confirmation_ttl_minutes: number
    // The model used for the module's own errands - naming a conversation
    // today, summarising a long one later. null means the agent's own model
    // does that work too.
    ai_llm_provider_id_utility: number | null
}

export interface AiSettingsIndexResponse {
    AiSetting: AiSettings
    _csrfToken: string
}
