import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { AiChatMessage } from '../aichat/ai-chat.interface';

export interface AiChatSessionsIndex extends PaginateOrScroll {
    all_sessions: AiChatSession[]
    /**
     * The agents that actually have readable conversations, with a count.
     *
     * Derived from the conversations rather than from the agent list, so the
     * filter never offers something that yields an empty page.
     */
    agents: AiChatSessionAgent[]
    _csrfToken: string
}

export interface AiChatSessionAgent {
    id: number
    name: string
    icon: string
    count: number
}

export interface AiChatSessionsIndexParams {
    angular: true
    scroll: boolean
    sort: string
    page: number
    direction: 'asc' | 'desc' | ''
    limit: number
    'filter[AiChatSessions.title]': string
    'filter[AiChatSessions.ai_agent_id]': number | ''
}

export function getDefaultAiChatSessionsIndexParams(): AiChatSessionsIndexParams {
    return {
        angular: true,
        scroll: false,
        sort: 'AiChatSessions.last_activity',
        page: 1,
        direction: 'desc',
        limit: 25,
        'filter[AiChatSessions.title]': '',
        'filter[AiChatSessions.ai_agent_id]': ''
    };
}

export interface AiChatSession {
    id: number
    uuid: string
    ai_agent_id: number
    user_id: number
    container_id: number
    title: string
    state: 'open' | 'archived'
    last_activity: string
    message_count: number
    turn_count: number
    total_prompt_tokens: number
    total_completion_tokens: number
    // Only your own conversation can be continued or renamed; someone else's
    // can at most be read.
    is_own: boolean
    agent_name: string | null
    agent_icon: string | null
}

export interface AiChatSessionView {
    AiChatSession: AiChatSession
    messages: AiChatMessage[]
    _csrfToken: string
}
