import { HostObject } from '../../../hosts/hosts.interface';
import { ServiceObject, ServicestatusObject } from '../../../services/services.interface';
import { PerformanceWidgetDatasources } from '../widgets.interface';


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
        Perfdata: PerformanceWidgetDatasources | any[] // empty array if no service is selected
    }
    config: CylinderWidgetConfig
    _csrfToken: string | null
}

export interface CylinderWidgetConfig {
    show_label: boolean
    metric: null | string
}


