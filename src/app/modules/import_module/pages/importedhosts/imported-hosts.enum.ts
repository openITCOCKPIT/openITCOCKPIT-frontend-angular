// Keep in Sync with backend API
// https://github.com/it-novum/openITCOCKPIT/blob/development/src/Lib/Constants.php#L167-L173
export enum ImportedHostFlagsEnum {
    FLAG_BLANK = 0,     // 0
    FLAG_MARKED_FOR_DISABLE = 1 << 1,  // 1
    FLAG_MARKED_FOR_ENABLE = 1 << 2,   // 2
    FLAG_MARKED_NEW = 1 << 2,   // 4
    FLAG_MARKED_CHANGED = 1 << 2   // 8
}
