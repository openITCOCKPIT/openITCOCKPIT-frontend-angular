import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';

/**
 * An option list for oitc-select whose key is a string.
 *
 * The shared SelectKeyValue types a numeric key, which fits a database id
 * but not an enumeration like the system prompt mode.
 */
export interface AiSelectOption {
    key: string
    value: string
}

export interface AiAgentsIndex extends PaginateOrScroll {
    all_agents: AiAgent[]
    _csrfToken: string
}

export interface AiAgent {
    id: number
    container_id: number
    container?: string
    name: string
    description: string | null
    icon: string
    ai_llm_provider_id: number
    ai_mcp_server_id: number
    system_prompt_mode: AiSystemPromptMode
    system_prompt_language: string
    system_prompt_custom: string | null
    system_prompt_cache_fetched_at: string | null
    max_steps: number
    max_history_messages: number
    tool_result_max_chars: number
    allow_write_tools: boolean
    confirmation_ttl_minutes: number
    is_enabled: boolean
    allow_edit?: boolean
}

/**
 * Where an agent's system prompt comes from.
 *
 * 'mcp' is the default and the point: the MCP server serves a prompt per
 * toolset, written by the same people who wrote the tools. A copy kept in this
 * module would drift on every server upgrade.
 */
export type AiSystemPromptMode = 'mcp' | 'mcp_plus_custom' | 'custom';

export interface AiAgentPost {
    container_id: number | null
    name: string
    description: string
    icon: string
    ai_llm_provider_id: number | null
    ai_mcp_server_id: number | null
    system_prompt_mode: AiSystemPromptMode
    system_prompt_language: string
    system_prompt_custom: string
    max_steps: number
    max_history_messages: number
    tool_result_max_chars: number
    allow_write_tools: boolean
    confirmation_ttl_minutes: number
    is_enabled: boolean
}

export function getDefaultAiAgentPost(): AiAgentPost {
    return {
        container_id: null,
        name: '',
        description: '',
        icon: 'robot',
        ai_llm_provider_id: null,
        ai_mcp_server_id: null,
        system_prompt_mode: 'mcp',
        system_prompt_language: 'en',
        system_prompt_custom: '',
        max_steps: 8,
        max_history_messages: 40,
        tool_result_max_chars: 20000,
        // Off by default even when the MCP instance has write tools: turning
        // this on is a decision somebody should make on purpose.
        allow_write_tools: false,
        confirmation_ttl_minutes: 60,
        is_enabled: true
    };
}

/**
 * One MCP instance an agent can be pointed at.
 *
 * The service account label travels with the option because choosing an
 * instance is choosing whose reach the agent borrows - that belongs at the
 * moment of the decision, not in documentation.
 */
export interface AiMcpServerOption {
    id: number
    name: string
    slug: string
    toolsets: string
    write_tools_enabled: boolean
    service_account_label: string | null
    tools_synced_at: string | null
}

export interface AiMcpServersOptionResponse {
    mcp_servers: AiMcpServerOption[]
    _csrfToken: string
}

/** One tool as the instance reported it, with the operator's own switches. */
export interface AiMcpTool {
    id: number
    name: string
    title: string | null
    description: string | null
    read_only: boolean
    destructive: boolean
    requires_confirmation: boolean
    is_enabled: boolean
}

/**
 * Which instance a catalogue belongs to, travelling with it so the catalogue
 * page can name itself without a second request. allow_edit decides whether
 * the switches on that page are the reader's to touch.
 */
export interface AiMcpToolsServer {
    id: number
    name: string
    slug: string
    url: string
    toolsets: string
    write_tools_enabled: boolean
    service_account_label: string | null
    is_enabled: boolean
    allow_edit: boolean
}

export interface AiMcpToolsResponse {
    server: AiMcpToolsServer
    tools: AiMcpTool[]
    tools_synced_at: string | null
    _csrfToken: string
}

export interface AiAgentPromptResponse {
    system_prompt: string
    fetched_at: string | null
    error: string | null
    _csrfToken: string
}

export interface AiAgentsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '',
    'filter[AiAgents.name]': string,
    'filter[AiAgents.is_enabled]': string
}

export function getDefaultAiAgentsIndexParams(): AiAgentsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'AiAgents.name',
        page: 1,
        direction: 'asc',
        'filter[AiAgents.name]': '',
        'filter[AiAgents.is_enabled]': ''
    };
}
