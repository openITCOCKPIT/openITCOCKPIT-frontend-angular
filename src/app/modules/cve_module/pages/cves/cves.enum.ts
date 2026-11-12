// Keep in sync with the backend: CveModule\Lib\Policy\FindingView
export enum CveViews {
    Action = 'action',
    Unfixed = 'unfixed',
    Accepted = 'accepted',
    NotAffected = 'not_affected'
}

// Keep in sync with the backend: CveModule\Model\Entity\CveDecision::STATE_*
export enum CveDecisionStates {
    Accepted = 'accepted',
    NotAffected = 'not_affected',
    InProgress = 'in_progress'
}

// Tabs of the host details, the four views plus the coverage
export enum CveHostTabs {
    Action = 'action',
    Unfixed = 'unfixed',
    Accepted = 'accepted',
    NotAffected = 'not_affected',
    Coverage = 'coverage'
}

// Keep in sync with the backend: CveModule\Lib\Policy\Severity
export enum CveSeverities {
    None = 0,
    Low = 1,
    Medium = 2,
    High = 3,
    Critical = 4
}
