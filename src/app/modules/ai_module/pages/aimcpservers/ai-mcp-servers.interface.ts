import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';

export interface AiMcpServersIndex extends PaginateOrScroll {
    all_mcp_servers: AiMcpServer[]
    _csrfToken: string
}

export interface AiMcpServer {
    id: number
    container_id: number
    container?: string
    // The join key across every deployment layer: systemd instance name,
    // environment variable prefix and compose service name all follow it.
    slug: string
    name: string
    description: string | null
    url: string
    toolsets: string
    write_tools_enabled: boolean
    // Documents whose reach the agents pointed at this instance borrow.
    service_account_user_id: number | null
    service_account_label: string | null
    ignore_ssl_certificate: boolean
    timeout_seconds: number
    is_enabled: boolean
    protocol_era: string | null
    last_seen: string | null
    tools_synced_at: string | null
    last_error: string | null
    has_auth_token: boolean
    allow_edit?: boolean
    // Counted for the list, which offers it as the way into the catalogue.
    tool_count: number
}

export interface AiMcpServerPost {
    container_id: number | null
    slug: string
    name: string
    description: string
    url: string
    // Empty means "keep the stored token".
    auth_token: string
    toolsets: string
    write_tools_enabled: boolean
    service_account_label: string
    ignore_ssl_certificate: boolean
    timeout_seconds: number
    is_enabled: boolean
}

export function getDefaultAiMcpServerPost(): AiMcpServerPost {
    return {
        container_id: null,
        slug: '',
        name: '',
        description: '',
        url: '',
        auth_token: '',
        toolsets: 'all',
        write_tools_enabled: false,
        service_account_label: '',
        ignore_ssl_certificate: false,
        timeout_seconds: 60,
        is_enabled: true
    };
}

export interface AiMcpServerTestResponse {
    success: boolean
    tool_count: number
    tools: string[]
    message: string
    _csrfToken: string
}

export interface AiMcpServerSyncResponse {
    success: boolean
    result: { created: number, updated: number, removed: number }
    message: string
    _csrfToken: string
}
