// Keep in Sync with backend API
// https://github.com/it-novum/openITCOCKPIT/blob/development/src/Lib/Constants.php#L86-L93
export enum HosttemplateTypesEnum {
    GENERIC_HOSTTEMPLATE = 1 << 0, // 1
    EVK_HOSTTEMPLATE = 1 << 1,     // 2
    //SLA_HOSTTEMPLATE = 1 << 2      // 4 There is no SAL HOST TEMPLATE
}
