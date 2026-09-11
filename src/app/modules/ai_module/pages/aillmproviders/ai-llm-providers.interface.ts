import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';

export interface AiLlmProvidersIndex extends PaginateOrScroll {
    all_providers: AiLlmProvider[]
    _csrfToken: string
}

export interface AiLlmProvider {
    id: number
    container_id: number
    container?: string
    name: string
    base_url: string
    model: string
    temperature: number | null
    max_tokens: number | null
    timeout_seconds: number
    ignore_ssl_certificate: boolean
    extra_headers: string | null
    extra_body: string | null
    is_enabled: boolean
    // The key itself is never sent. This says whether one is stored.
    has_api_key: boolean
    allow_edit?: boolean
}

export interface AiLlmProviderPost {
    container_id: number | null
    name: string
    base_url: string
    // Empty means "leave the stored key alone", which is how the edit form
    // works without the key ever reaching the browser.
    api_key: string
    model: string
    temperature: number | null
    max_tokens: number | null
    timeout_seconds: number
    ignore_ssl_certificate: boolean
    extra_headers: string
    extra_body: string
    is_enabled: boolean
}

export function getDefaultAiLlmProviderPost(): AiLlmProviderPost {
    return {
        container_id: null,
        name: '',
        base_url: '',
        api_key: '',
        model: '',
        temperature: null,
        max_tokens: null,
        timeout_seconds: 120,
        ignore_ssl_certificate: false,
        extra_headers: '',
        extra_body: '',
        is_enabled: true
    };
}

/**
 * What /models answered. The list is an aid, never a constraint: the endpoint
 * may not implement it, and a key is often scoped to fewer models than the
 * endpoint serves - so the name stays typeable either way.
 */
export interface AiLlmProviderModelsResponse {
    success: boolean
    models: string[]
    message: string
    _csrfToken: string
}

export interface AiLlmProviderTestResponse {
    success: boolean
    message: string
    answer: string
    _csrfToken: string
}
