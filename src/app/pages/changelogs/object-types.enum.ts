// Keep in Sync with backend API
// https://github.com/it-novum/openITCOCKPIT/blob/development/src/Lib/Constants.php#L86-L93
export enum ObjectTypesEnum {
    'TENANT' = 1 << 0,
    'USER' = 1 << 1,
    'NODE' = 1 << 2,
    'LOCATION' = 1 << 3,
    'DEVICEGROUP' = 1 << 4,
    'CONTACT' = 1 << 5,
    'CONTACTGROUP' = 1 << 6,
    'TIMEPERIOD' = 1 << 7,
    'HOST' = 1 << 8,
    'HOSTTEMPLATE' = 1 << 9,
    'HOSTGROUP' = 1 << 10,
    'SERVICE' = 1 << 11,
    'SERVICETEMPLATE' = 1 << 12,
    'SERVICEGROUP' = 1 << 13,
    'COMMAND' = 1 << 14,
    'SATELLITE' = 1 << 15,
    'SERVICETEMPLATEGROUP' = 1 << 16,
    'HOSTESCALATION' = 1 << 17,
    'SERVICEESCALATION' = 1 << 18,
    'HOSTDEPENDENCY' = 1 << 19,
    'SERVICEDEPENDENCY' = 1 << 20,
    'EXPORT' = 1 << 21
}

export const ROOT_CONTAINER = 1;

export enum ContainerTypesEnum {
    'CT_GLOBAL' = 1,
    'CT_TENANT' = 2,
    'CT_LOCATION' = 3,
    'CT_DEVICEGROUP' = 4, // Devicegroups got replaced by nodes with ITC-653.
    'CT_NODE' = 5,
    'CT_CONTACTGROUP' = 6,
    'CT_HOSTGROUP' = 7,
    'CT_SERVICEGROUP' = 8,
    'CT_SERVICETEMPLATEGROUP' = 9,
    'CT_RESOURCEGROUP' = 10
}
