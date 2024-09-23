// Keep in Sync with backend API
// https://github.com/it-novum/openITCOCKPIT/blob/development/src/Lib/Constants.php#L188-L196
export enum ServiceTypesEnum {
    GENERIC_SERVICE = 1 << 0,       // 1
    EVK_SERVICE = 1 << 1,           // 2
    SLA_SERVICE = 1 << 2,           // 4
    MK_SERVICE = 1 << 3,            // 8
    OITC_AGENT_SERVICE = 1 << 4,    // 16
    PROMETHEUS_SERVICE = 1 << 5,    // 32
    EXTERNAL_SERVICE = 1 << 6,      // 64
}


export enum ServiceBrowserTabs {
    StatusInformation = 'StatusInformation',
    ServiceInformation = 'ServiceInformation',
    Timeline = 'Timeline',
    ServiceNow = 'ServiceNow',
    CustomAlerts = 'CustomAlerts',
    SLA = 'SLA',
}
