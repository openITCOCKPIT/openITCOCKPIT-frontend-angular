import { HostObject } from '../../../hosts/hosts.interface';
import { ServiceObject, ServicestatusObject } from '../../../services/services.interface';
import { PerformanceWidgetDatasources } from '../widgets.interface';
export interface TachometerWidgetServiceObject extends ServiceObject {
    isGenericService: boolean
    isEVCService: boolean
    isSLAService: boolean
    isMkService: boolean
}

export interface TachometerWidgetConfigRootResponse {
    service: {
        Host?: HostObject // Missing if no service is selected
        Service: TachometerWidgetServiceObject | any[] // empty array if no service is selected
        Servicestatus: ServicestatusObject | any[] // empty array if no service is selected
        Perfdata: PerformanceWidgetDatasources | any[] // empty array if no service is selected
    }
    config: TachometerWidgetConfig
    _csrfToken: string | null
}

// See TachoJson.php for source of data
export interface TachometerWidgetConfig {
    show_label: boolean
    metric: null | string
}


/**
 * {
 *     rta: {
 *         current: "200"
 *         unit: "ms",
 *         warning: "100",
 *         critical: "200",
 *         metric: "rta",
 *          datasource: {
 *              setup: {
 *                  ...
 *              }
 *          }
 *     }
 * }
 */

