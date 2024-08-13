// Keep in Sync with backend API
// https://github.com/it-novum/openITCOCKPIT/blob/development/src/Lib/Constants.php#L167-L173
export enum HostTypesEnum {
    GENERIC_HOST = 1 << 0, // 1
    EVK_HOST = 1 << 1,     // 2
    SLA_HOST = 1 << 2      // 4
}

export enum HostSubmitType {
    HostsIndex = 'HostsIndex',
    AgentDiscovery = 'AgentDiscovery',
    CheckmkDiscovery = 'CheckmkDiscovery',
    ServiceAdd = 'ServiceAdd',
    AssignMatchingServicetemplateGroups = 'AssignMatchingServicetemplateGroups',
}

export enum HostBrowserTabs {
    StatusInformation = 'StatusInformation',
    DeviceInformation = 'DeviceInformation',
    Timeline = 'Timeline',
    ServiceNow = 'ServiceNow',
    Grafana = 'Grafana',
    CMDB = 'CMDB',
    SLA = 'SLA',
}
