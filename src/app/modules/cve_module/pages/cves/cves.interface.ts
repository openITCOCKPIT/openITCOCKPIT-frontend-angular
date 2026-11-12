import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { CveDecisionStates, CveViews } from './cves.enum';

/*
 * The API returns codes, never texts. The components translate them, see components/cve-labels.
 * Points in time come as ISO 8601 and as <field>_user in the date format of the user.
 */

/**********************
 *       Codes        *
 **********************/

export type CveColor = 'red' | 'yellow' | 'green' | 'gray';

// State of a host at the time of the request (HostRules::state())
export type CveAssessmentStatus = 'evaluated' | 'partial' | 'stale' | 'failed' | 'not_evaluated';

// Result of the last evaluation as stored (EvaluationStatus)
export type CveEvaluationStatus = 'complete' | 'partial' | 'not_evaluable' | 'failed';

export type CveRule =
    'cisa_kev'
    | 'weaponized_exploit'
    | 'high_priority'
    | 'vulncheck_kev'
    | 'inactive_kernel'
    | 'priority_unknown'
    | 'review_required'
    | 'remedy_available'
    | 'no_fix'
    | 'accepted'
    | 'not_affected';

export type CveAction =
    'review_decision'
    | 'remove_or_update_kernel'
    | 'reboot_into_kernel'
    | 'install_os_update'
    | 'install_update'
    | 'check_fixed_version'
    | 'update_to_vendor_version'
    | 'watch_vendor'
    | 'update_kernel_and_reboot'
    | 'update_operating_system'
    | 'update_application'
    | 'update_package'
    | 'check_mitigation';

// Severity of the vendor, 0 to 4, null if unknown
export type CveSeverity = 0 | 1 | 2 | 3 | 4 | null;

export interface CveRecommendation {
    action: CveAction
    version: string | null
}

export interface CveHostOfRow {
    id: number
    name: string
    uuid: string
    container_id: number
    disabled?: number
}

/**********************
 *    Index action    *
 **********************/

export interface CveHostState {
    status: CveAssessmentStatus
    color: CveColor
    sort_order: number
    inventory_age_days: number | null
}

export interface CveHostSummary {
    id: number
    host_id: number
    platform: string
    status: CveEvaluationStatus
    color: CveColor
    feed_digest: string | null
    inventory_last_update: string | null
    inventory_last_update_user?: string
    evaluated: string | null
    evaluated_user?: string
    failed: string | null
    failed_user?: string
    error_message: string | null
    critical_count: number
    high_count: number
    medium_count: number
    low_count: number
    unknown_count: number
    open_count: number
    red_count: number
    action_count: number
    kev_count: number
    exploit_count: number
    fixable_count: number
    accepted_count: number
    not_affected_count: number
    in_progress_count: number
    installations: number
    evaluated_installations: number
    host: CveHostOfRow
    state: CveHostState
}

export interface CvesIndexRoot extends PaginateOrScroll {
    hosts: CveHostSummary[]
    _csrfToken: string
}

export interface CvesIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '',
    'filter[Hosts.name]': string,
    'filter[CveHostSummaries.status][]': CveEvaluationStatus[],
    'filter[CveHostSummaries.color][]': CveColor[],
    'filter[CveHostSummaries.platform][]': string[],
    'filter[CveHostSummaries.kev_count]': number | '',
    'filter[CveHostSummaries.exploit_count]': number | '',
}

export function getDefaultCvesIndexParams(): CvesIndexParams {
    return {
        angular: true,
        scroll: true,
        // Empty: the API sorts by urgency
        sort: '',
        page: 1,
        direction: '',
        'filter[Hosts.name]': '',
        'filter[CveHostSummaries.status][]': [],
        'filter[CveHostSummaries.color][]': [],
        'filter[CveHostSummaries.platform][]': [],
        'filter[CveHostSummaries.kev_count]': '',
        'filter[CveHostSummaries.exploit_count]': '',
    }
}

/**********************
 *   Summary action   *
 **********************/

export interface CveTotals {
    open: number
    critical: number
    high: number
    medium: number
    low: number
    unknown: number
    kev: number
    exploit: number
    fixable: number
    action: number
    red: number
    in_progress: number
}

export interface CvesSummary {
    hosts: {
        total: number
        statuses: Partial<Record<CveAssessmentStatus, number>>
        colors: Partial<Record<CveColor, number>>
    }
    cves: CveTotals
    feed: {
        digest: string | null
        feed_date: string | null
        feed_date_user?: string
        outdated: boolean
    }
    last_evaluation: string | null
    last_evaluation_user?: string
    policy_version: string
}

export interface CvesSummaryRoot {
    summary: CvesSummary
    _csrfToken: string
}

/**********************
 *    Trend action    *
 **********************/

export interface CveTrendDay {
    stat_date: string // Y-m-d
    hosts: number
    open_count: number
    action_count: number
    red_count: number
    kev_count: number
    new_count: number
    resolved_count: number
}

export interface CvesTrendRoot {
    trend: CveTrendDay[]
    _csrfToken: string
}

/**********************
 *    Host action     *
 **********************/

export interface CveInventory {
    os_type: string | null
    os_name: string | null
    os_version: string | null
    os_family: string | null
    kernel_release: string | null
    agent_version: string | null
    last_update: string | null
    last_update_user?: string
}

export interface CveViewCount {
    findings: number
    cves: number
}

export interface CvesHostRoot {
    // null if the host has never been evaluated
    summary: CveHostSummary | null
    inventory: CveInventory | null
    views: Record<CveViews, CveViewCount>
    allowEdit: boolean
    _csrfToken: string
}

/**********************
 * Host components    *
 **********************/

export interface CveHostComponent {
    component_type: string
    component_name: string
    component_version: string
    is_kernel: boolean
    is_running: boolean | null
    update_available: boolean
    usable_update: boolean
    update_version: string | null
    lowest_rule_rank: number
    highest_severity: CveSeverity
    cve_count: number
    red_count: number
    kev_count: number
    exploit_count: number
    in_progress_count: number
    recommendation: CveRecommendation
}

export interface CvesHostComponentsRoot extends PaginateOrScroll {
    components: CveHostComponent[]
    _csrfToken: string
}

export interface CvesHostComponentsParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '',
    view: CveViews,
    'filter[CveHostFindings.component_name]': string,
    'filter[CveHostFindings.color][]': CveColor[],
    'filter[CveHostFindings.is_kernel]': '' | 1 | 0,
    'filter[CveHostFindings.update_available]': '' | 1 | 0,
}

export function getDefaultCvesHostComponentsParams(view: CveViews): CvesHostComponentsParams {
    return {
        angular: true,
        scroll: true,
        sort: '',
        page: 1,
        direction: '',
        view: view,
        'filter[CveHostFindings.component_name]': '',
        'filter[CveHostFindings.color][]': [],
        'filter[CveHostFindings.is_kernel]': '',
        'filter[CveHostFindings.update_available]': '',
    }
}

/**********************
 *      Findings      *
 **********************/

export interface CveOfFinding {
    id: number
    cve_id: string
    summary: string | null
    published: string | null
    published_user?: string
    cvss_score: number | null
    cvss_vector?: string | null
    cvss_source: string | null
    kev_cisa: boolean
    kev_cisa_added?: string | null
    kev_vulncheck: boolean
    metasploit_count: number
    verified_exploit_count: number
    poc_exploit_count: number
    // Neutral link of NVD, the link of the vendor depends on the host: CveFinding.advisory_link
    nvd_link?: string | null
}

export interface CveDecision {
    id: number
    cve_host_finding_id: number
    state: CveDecisionStates
    owner: string
    reason: string
    review_after: string // Y-m-d
    evidence_url: string | null
    severity: CveSeverity
    fixed_in: string | null
    fix_state: string | null
    not_fixed_yet: boolean
    policy_version: string
    user_id: number | null
    created: string
    created_user?: string
    modified: string
    modified_user?: string
    user: {
        id: number
        name: string
    } | null
}

export interface CveFinding {
    id: number
    host_id: number
    cve_id: number
    component_type: string
    component_name: string
    component_version: string
    is_kernel: boolean
    is_running: boolean | null
    fixed_in: string | null
    fix_state: string | null
    not_fixed_yet: boolean
    update_available: boolean
    update_version: string | null
    // Running kernel only: installed kernel that fixes the CVE after a reboot
    reboot_version?: string | null
    severity: CveSeverity
    severity_source: string | null
    view_name: CveViews
    rule: CveRule
    color: CveColor
    rule_rank: number
    review_required: boolean
    policy_version: string
    first_seen: string
    first_seen_user?: string
    last_seen: string
    last_seen_user?: string
    resolved_at: string | null
    resolved_at_user?: string
    reopened_at: string | null
    reopened_at_user?: string
    reopen_count: number
    host: CveHostOfRow
    cve: CveOfFinding
    reason_codes: string[]
    // Page of the vendor of the operating system of the host, e.g. the Debian Security Tracker, null if there is none
    advisory_link: string | null
    // null if the rule is unknown to the current policy
    recommendation: CveRecommendation | null
    decision: CveDecision | null
}

export interface CvesHostFindingsRoot extends PaginateOrScroll {
    findings: CveFinding[]
    _csrfToken: string
}

export interface CvesHostFindingsParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '',
    view: CveViews,
    component_name: string,
    component_version: string,
    // Page size, only to get all findings of a component at once (the API decides on at most 5000)
    limit?: number,
}

export function getDefaultCvesHostFindingsParams(view: CveViews, componentName: string, componentVersion: string): CvesHostFindingsParams {
    return {
        angular: true,
        // Pagination, a kernel can have thousands of CVEs
        scroll: false,
        sort: '',
        page: 1,
        direction: '',
        view: view,
        component_name: componentName,
        component_version: componentVersion,
    }
}

/**********************
 *   Coverage action  *
 **********************/

export interface CveCoverage {
    // Codes of CoverageReason
    reasons: string[]
    // Lists of packages per type, e.g. missing_metadata and inactive_kernel
    items: Record<string, string[]>
    status: CveEvaluationStatus | null
    installations: number
    evaluated_installations: number
    error_message: string | null
}

export interface CvesHostCoverageRoot {
    coverage: CveCoverage
    _csrfToken: string
}

/**********************
 *   Finding action   *
 **********************/

export interface CvesFindingRoot {
    finding: CveFinding
    allowEdit: boolean
    decisionStates: CveDecisionStates[]
    _csrfToken: string
}

/**********************
 *   Decide action    *
 **********************/

export interface CveDecisionPost {
    state: CveDecisionStates | null
    owner: string
    reason: string
    review_after: string // Y-m-d
    evidence_url: string
}

export interface CveDecideResponse {
    success: boolean
    decisions?: number
    removed?: number
    hostIds: number[]
}

/**********************
 *  Decisions action  *
 **********************/

export interface CveDecisionRow extends CveDecision {
    host_id: number
    host_name: string
    host_uuid: string
    cve_id: string
    component_type: string
    component_name: string
    component_version: string
    view_name: CveViews
    rule: CveRule
    color: CveColor
    review_required: boolean
}

export interface CvesDecisionsRoot extends PaginateOrScroll {
    decisions: CveDecisionRow[]
    _csrfToken: string
}

export interface CvesDecisionsParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '',
    'filter[Hosts.name]': string,
    'filter[Cves.cve_id]': string,
    'filter[CveDecisions.owner]': string,
    'filter[CveDecisions.state][]': CveDecisionStates[],
    'filter[CveDecisions.review_after]': string, // Due until, Y-m-d
}

export function getDefaultCvesDecisionsParams(): CvesDecisionsParams {
    return {
        angular: true,
        scroll: true,
        sort: '',
        page: 1,
        direction: '',
        'filter[Hosts.name]': '',
        'filter[Cves.cve_id]': '',
        'filter[CveDecisions.owner]': '',
        'filter[CveDecisions.state][]': [],
        'filter[CveDecisions.review_after]': '',
    }
}

/**********************
 *    Cves action     *
 **********************/

export interface CveAggregate extends CveOfFinding {
    highest_severity: CveSeverity
    lowest_rule_rank: number
    host_count: number
    action_host_count: number
    red_host_count: number
    fixable_host_count: number
    finding_count: number
}

export interface CvesCvesRoot extends PaginateOrScroll {
    cves: CveAggregate[]
    _csrfToken: string
}

export interface CvesCvesParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '',
    'filter[Cves.cve_id]': string,
    'filter[Cves.summary]': string,
    'filter[CveHostFindings.color][]': CveColor[],
    'filter[Cves.kev_cisa]': '' | 1 | 0,
    'filter[Cves.cvss_score]': number | '',
}

export function getDefaultCvesCvesParams(): CvesCvesParams {
    return {
        angular: true,
        scroll: true,
        sort: '',
        page: 1,
        direction: '',
        'filter[Cves.cve_id]': '',
        'filter[Cves.summary]': '',
        'filter[CveHostFindings.color][]': [],
        'filter[Cves.kev_cisa]': '',
        'filter[Cves.cvss_score]': '',
    }
}

/**********************
 *    View action     *
 **********************/

export interface CvesViewRoot extends PaginateOrScroll {
    cve: CveOfFinding
    findings: CveFinding[]
    _csrfToken: string
}

export interface CvesViewParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '',
    'filter[Hosts.name]': string,
    'filter[CveHostFindings.component_name]': string,
    'filter[CveHostFindings.color][]': CveColor[],
}

export function getDefaultCvesViewParams(): CvesViewParams {
    return {
        angular: true,
        scroll: true,
        sort: '',
        page: 1,
        direction: '',
        'filter[Hosts.name]': '',
        'filter[CveHostFindings.component_name]': '',
        'filter[CveHostFindings.color][]': [],
    }
}

/***************************
 * Recommendations action  *
 ***************************/

export interface CveRecommendationRow {
    component_type: string
    component_name: string
    is_kernel: boolean
    update_version: string | null
    update_available: boolean
    usable_update: boolean
    host_update_count: number
    lowest_rule_rank: number
    highest_severity: CveSeverity
    cve_count: number
    red_count: number
    kev_count: number
    host_count: number
    version_count: number
    recommendation: CveRecommendation
}

export interface CvesRecommendationsRoot extends PaginateOrScroll {
    recommendations: CveRecommendationRow[]
    _csrfToken: string
}

export interface CvesRecommendationsParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '',
    'filter[CveHostFindings.component_name]': string,
    'filter[CveHostFindings.color][]': CveColor[],
    'filter[CveHostFindings.is_kernel]': '' | 1 | 0,
}

export function getDefaultCvesRecommendationsParams(): CvesRecommendationsParams {
    return {
        angular: true,
        scroll: true,
        sort: '',
        page: 1,
        direction: '',
        'filter[CveHostFindings.component_name]': '',
        'filter[CveHostFindings.color][]': [],
        'filter[CveHostFindings.is_kernel]': '',
    }
}

/**********************
 *  Software action   *
 **********************/

export interface CveSoftwareRow {
    component_type: string
    component_name: string
    component_version: string
    is_kernel: boolean
    lowest_rule_rank: number
    highest_severity: CveSeverity
    cve_count: number
    action_count: number
    red_count: number
    host_count: number
}

// Rows of software.json with component_name and component_version: the hosts of one component
export interface CveSoftwareHostRow {
    host_id: number
    host_name: string
    host_uuid: string
    component_type: string
    is_kernel: boolean
    is_running: boolean | null
    update_available: boolean
    usable_update: boolean
    update_version: string | null
    lowest_rule_rank: number
    highest_severity: CveSeverity
    cve_count: number
    action_count: number
    red_count: number
}

export interface CvesSoftwareRoot extends PaginateOrScroll {
    software: CveSoftwareRow[]
    _csrfToken: string
}

export interface CvesSoftwareHostsRoot extends PaginateOrScroll {
    software: CveSoftwareHostRow[]
    _csrfToken: string
}

export interface CvesSoftwareParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '',
    'filter[CveHostFindings.component_name]': string,
    'filter[CveHostFindings.component_version]': string,
    'filter[CveHostFindings.is_kernel]': '' | 1 | 0,
}

export function getDefaultCvesSoftwareParams(): CvesSoftwareParams {
    return {
        angular: true,
        scroll: true,
        sort: '',
        page: 1,
        direction: '',
        'filter[CveHostFindings.component_name]': '',
        'filter[CveHostFindings.component_version]': '',
        'filter[CveHostFindings.is_kernel]': '',
    }
}

export interface CvesSoftwareHostsParams extends CvesSoftwareParams {
    component_name: string,
    component_version: string,
}

/**********************
 * Host states action *
 **********************/

export interface CveHostStateOfHost {
    host_id: number
    platform: string
    status: CveEvaluationStatus
    color: CveColor
    inventory_last_update: string | null
    inventory_last_update_user?: string
    evaluated: string | null
    evaluated_user?: string
    open_count: number
    action_count: number
    red_count: number
    kev_count: number
    state: CveHostState
}

export interface CvesHostStatesRoot {
    // Key is the id of the host. Hosts without evaluation or without permission are missing.
    states: Record<number, CveHostStateOfHost>
    _csrfToken: string
}
