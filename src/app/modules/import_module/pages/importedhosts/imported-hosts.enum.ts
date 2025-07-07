// Keep in Sync with backend API
// https://github.com/openITCOCKPIT/openITCOCKPIT/blob/development/src/Lib/Constants.php#L167-L173
export enum ImportedHostFlagsEnum {
    FLAG_BLANK = 0,                     // 0
    FLAG_MARKED_FOR_DISABLE = 1 << 0,   // 1
    FLAG_MARKED_FOR_ENABLE = 1 << 1,    // 2
    FLAG_MARKED_NEW = 1 << 2,           // 4
    FLAG_MARKED_CHANGED = 1 << 3        // 8
}
