import { EventcorrelationOperators } from '../../eventcorrelations.enum';
import { ServicestatusObject } from '../../../../../../pages/services/services.interface';

export interface ConnectionOperator {
    id: string
    from: string
    to: string
}

export interface EvcTreeValidationErrors {
    [key: string | number]: boolean
}

export interface EvcScoringInformationForRendering {
    operator_warning_min?: number | null
    operator_warning_max?: number | null
    operator_critical_min?: number | null
    operator_critical_max?: number | null
    operator_unknown_min?: number | null
    operator_unknown_max?: number | null
    score_warning?: number | null
    score_critical?: number | null
    score_unknown?: number | null
    operator?: EventcorrelationOperators
    servicestatus?: ServicestatusObject
    isUsedInScoringOperator: boolean
    currentStateConsiderDowntimeOrDisabled?: number
}
