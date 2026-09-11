import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';

export interface AiAuditLogIndex extends PaginateOrScroll {
    all_entries: AiAuditLogEntry[]
    _csrfToken: string
}

/**
 * One recorded action.
 *
 * Deliberately carries no prompt or completion text - the audit records what
 * was done, the conversation lives under its own retention.
 */
export interface AiAuditLogEntry {
    id: number
    container_id: number
    user_id: number | null
    ai_agent_id: number | null
    ai_mcp_server_id: number | null
    ai_chat_session_id: number | null
    ai_chat_turn_id: number | null
    session_uuid: string | null
    event: string
    tool_name: string | null
    arguments: string | null
    read_only: boolean | null
    status: 'ok' | 'error' | 'denied'
    message: string | null
    duration_ms: number | null
    created: string
}
