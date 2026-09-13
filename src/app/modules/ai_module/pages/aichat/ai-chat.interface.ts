export interface AiChatIndex {
    agents: AiChatAgent[]
    /** Recent conversations of this person, so one can be picked up again. */
    recent_sessions: AiChatRecentSession[]
    poll_interval_seconds: number
    _csrfToken: string
}

export interface AiChatRecentSession {
    id: number
    title: string
    ai_agent_id: number
    agent_name: string | null
    last_activity: string
    message_count: number
}

/** Who is answering in this conversation, sent with every poll. */
export interface AiChatSessionHeader {
    id: number
    title: string
    agent_id: number
    agent_name: string | null
    allow_write_tools: boolean
    total_prompt_tokens: number
    total_completion_tokens: number
    /** The tools this agent can reach. Sent once, when the conversation opens. */
    tools: string[] | null
}

export interface AiChatAgent {
    id: number
    name: string
    description: string | null
    icon: string
    allow_write_tools: boolean
    // Named so the person choosing an agent can see whose reach they borrow:
    // an agent can only see what its MCP instance's service account can see.
    service_account_label: string | null
    toolsets: string
}

export interface AiChatStartResponse {
    AiChatSession: {
        id: number
        uuid: string
    }
    _csrfToken: string
}

export interface AiChatSendResponse {
    AiChatTurn: {
        id: number
        state: AiTurnState
    }
    message_id: number
    _csrfToken: string
}

export type AiTurnState =
    'enqueued'
    | 'running'
    | 'awaiting_confirmation'
    | 'done'
    | 'failed'
    | 'cancelled';

export type AiMessageRole = 'user' | 'assistant' | 'tool';

export interface AiChatMessage {
    id: number
    role: AiMessageRole
    content: string | null
    /** What a reasoning model worked out first. Null unless one was used. */
    reasoning: string | null
    tool_name: string | null
    is_error: boolean
    has_tool_calls: boolean
    /** What an assistant message asked for; empty on every other role. */
    tool_calls: AiChatToolCall[]
    /** Which call a tool result answers. */
    tool_call_id: string | null
    created: string
}

export interface AiChatToolCall {
    id: string
    name: string
    /** Pretty-printed for reading. Empty when the tool takes no arguments. */
    arguments: string
}

/**
 * One tool call and the result it produced, paired for display.
 *
 * The two arrive as separate messages - the call is stored before it runs -
 * and are put back together here so the transcript can show a round of tool
 * work as one thing instead of as a stream of fragments.
 */
export interface AiChatToolStep {
    name: string
    arguments: string
    result: string | null
    is_error: boolean
    /** No result yet: this is the call currently running. */
    pending: boolean
}

/**
 * The transcript is rendered from these rather than from messages directly,
 * so that a round of tool work collapses into a single entry.
 */
export type AiChatEntry =
    { kind: 'message', id: number, message: AiChatMessage }
    | { kind: 'tools', id: number, steps: AiChatToolStep[], reasoning: string | null };

export interface AiChatTurnStatus {
    id: number
    state: AiTurnState
    error_kind: string | null
    error_message: string | null
}

export interface AiPendingConfirmation {
    id: number
    tool_name: string
    tool_title: string | null
    // The literal JSON that will be sent. Rendered verbatim in a code block -
    // what somebody approves has to be exactly what runs, never a summary.
    arguments_pretty: string
    destructive: boolean
    expires_at: string
    may_confirm: boolean
}

export interface AiChatPollResponse {
    session: AiChatSessionHeader | null
    messages: AiChatMessage[]
    turn: AiChatTurnStatus | null
    pending_confirmations: AiPendingConfirmation[]
    _csrfToken: string
}
