// Keep in Sync with backend API
// https://github.com/it-novum/openITCOCKPIT/blob/development/src/Lib/Constants.php#L167-L173
export enum HostTypesEnum {
    GENERIC_HOST = 1 << 0, // 1
    EVK_HOST = 1 << 1,     // 2
    SLA_HOST = 1 << 2      // 4
}
