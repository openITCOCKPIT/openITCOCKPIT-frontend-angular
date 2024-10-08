import { GenericValidationError } from '../../generic-responses';
import { HostObject, HoststatusObject } from '../hosts/hosts.interface';
import { ServiceObject, ServicestatusObject, } from '../services/services.interface';

export type ReportFormat = 'pdf' | 'html';

export interface CurrentStateReportsHtmlParams {
    services: number[],
    current_state: {
        ok: boolean,
        warning: boolean,
        critical: boolean,
        unknown: boolean
    }
    Servicestatus: {
        current_state: number[],
        hasBeenAcknowledged: boolean | null,
        inDowntime: boolean | null,
        passive: boolean | null,
    }
}

export interface CurrentStateReportResponseWrapper {
    success: boolean,
    data: GenericValidationError | CurrentStateReportHtmlResponse
}

export interface CurrentStateReportHtmlResponse {
    all_services: {
        [key: string]: CurrentStateReportService
    };
    _csrfToken: string;
}

export interface CurrentStateReportPerfdataArrayValue {
    current: null | string
    unit: null | string
    warning: null | string
    critical: null | string
    min: null | string
    max: null | string
    metric: string
}

export interface ServicestatusObjectWithPerfdataArray extends ServicestatusObject {
    perfdataArray: any[] | { [key: string]: CurrentStateReportPerfdataArrayValue };
    perfdataArrayCounter: number
}

export interface CurrentStateReportService {
    Host: HostObject,
    Hoststatus: HoststatusObject,
    Services: {
        [key: string]: {
            Service: ServiceObject,
            Servicestatus: ServicestatusObjectWithPerfdataArray
        }
    }
}
