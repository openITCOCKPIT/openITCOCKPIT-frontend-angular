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
    auth_header: string
    auth_prefix: string
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
    // A key is stored but no longer decryptable, because the application salt
    // changed. There is no way back: it has to be entered again.
    api_key_unreadable: boolean
    allow_edit?: boolean
}

export interface AiLlmProviderPost {
    container_id: number | null
    name: string
    base_url: string
    // Empty means "leave the stored key alone", which is how the edit form
    // works without the key ever reaching the browser.
    api_key: string
    // How the key goes on the request. "Authorization" + "Bearer" is what
    // OpenAI-compatible endpoints expect; Azure wants "api-key" with no
    // prefix, Anthropic "x-api-key".
    auth_header: string
    auth_prefix: string
    model: string
    temperature: number | null
    max_tokens: number | null
    timeout_seconds: number
    ignore_ssl_certificate: boolean
    extra_headers: string
    extra_body: string
    is_enabled: boolean
    // When copying: the provider whose stored key this one should use. The key
    // itself never reaches the browser, so only the reference travels.
    copy_api_key_from_id?: number
}

export function getDefaultAiLlmProviderPost(): AiLlmProviderPost {
    return {
        container_id: null,
        name: '',
        base_url: '',
        api_key: '',
        auth_header: 'Authorization',
        auth_prefix: 'Bearer',
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
    // Exactly what was sent, with the key masked. Built by the same code that
    // sends it, so it cannot drift from the real request.
    request: AiLlmProviderRequestPreview | null
    _csrfToken: string
}

export interface AiLlmProviderRequestPreview {
    url: string
    headers: { [name: string]: string }
    body: string
}
