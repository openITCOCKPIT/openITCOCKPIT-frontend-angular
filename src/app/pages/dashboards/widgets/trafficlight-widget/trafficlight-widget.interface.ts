import { HostObject } from '../../../hosts/hosts.interface';
import { ServiceBrowserPerfdata, ServiceObject, ServicestatusObject } from '../../../services/services.interface';

export interface TrafficlightWidgetServiceObject extends ServiceObject {
    isGenericService: boolean
    isEVCService: boolean
    isSLAService: boolean
    isMkService: boolean
}

export interface TrafficlightWidgetConfigRootResponse {
    service: {
        Host?: HostObject // Missing if no service is selected
        Service: TrafficlightWidgetServiceObject | any[] // empty array if no service is selected
        Servicestatus: ServicestatusObject | any[] // empty array if no service is selected
        Perfdata: {
            [key: string]: ServiceBrowserPerfdata
        } | any[] // empty array if no service is selected
    }
    config: TrafficlightWidgetConfig
    _csrfToken: string | null
}

// See TrafficlightJson.php for source of data
export interface TrafficlightWidgetConfig {
    show_label: boolean
}
