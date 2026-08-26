import { HostObject } from '../../../hosts/hosts.interface';
import { ServiceObject, ServicestatusObject } from '../../../services/services.interface';
import { ScaleTypes } from '../../../../components/popover-graph/scale-types';
import { CylinderWidgetComponent } from './cylinder-widget.component';

export interface CylinderWidgetServiceObject extends ServiceObject {
    isGenericService: boolean
    isEVCService: boolean
    isSLAService: boolean
    isMkService: boolean
}

export interface CylinderWidgetConfigRootResponse {
    service: {
        Host?: HostObject // Missing if no service is selected
        Service: CylinderWidgetServiceObject | any[] // empty array if no service is selected
        Servicestatus: ServicestatusObject | any[] // empty array if no service is selected
        Perfdata: CylinderWidgetDatasources | any[] // empty array if no service is selected
    }
    config: CylinderWidgetConfig
    _csrfToken: string | null
}

export interface CylinderWidgetConfig {
    show_label: boolean
    metric: null | string
}


export interface CylinderWidgetDatasources {
    [key: string]: CylinderWidgetPerfdata
}

export interface CylinderWidgetPerfdata {
    current: string
    unit: null | string
    warning: string | null
    critical: string | null
    min: number | null,
    max: number | null,
    metric: string
    datasource: {
        setup: {
            metric: {
                value: number,
                unit: string,
                name: ScaleTypes
            },
            scale: {
                min: number | null,
                max: number | null,
                type: string,
            }
            warn: {
                low: null | number,
                high: null | number,
            }
            crit: {
                low: null | number,
                high: null | number,
            }
        }
    }
}
