import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { ProfileMaxUploadLimit } from '../../../../pages/profile/profile.interface';
import { ConfigurationItemsExportImport } from './configurationitems.enum';

/**********************
 *    Export action   *
 **********************/

export interface ConfigurationitemsElementsExportPost {
    Configurationitems: {
        [ConfigurationItemsExportImport.commands]: {
            _ids: number[]
        },
        [ConfigurationItemsExportImport.timeperiods]: {
            _ids: number[]
        },
        [ConfigurationItemsExportImport.contacts]: {
            _ids: number[]
        },
        [ConfigurationItemsExportImport.contactgroups]: {
            _ids: number[]
        },
        [ConfigurationItemsExportImport.servicetemplates]: {
            _ids: number[]
        },
        [ConfigurationItemsExportImport.servicetemplategroups]: {
            _ids: number[]
        }
    }
}


export type ConfigurationitemsElementsExport = {
    [key in ConfigurationItemsExportImport]: SelectKeyValue[]
}

// The objects get JSON encoded and written into a file.
// TypeScript itself does not use the data at all. For this reason, we used any[] for the properties.
export interface ConfigurationitemsElementsJsonFile {
    export: {
        [key in ConfigurationItemsExportImport]: any[]
    }

    checksum: string,
    success: boolean,
    OPENITCOCKPIT_VERSION: string
}

/**********************
 *    Import action   *
 **********************/

export interface ConfigurationitemsImportRoot {
    maxUploadLimit: ProfileMaxUploadLimit
    success: boolean
    message: string
    fileInformation: ConfigurationitemsImportFileInformation
    relevantChanges: ConfigurationitemsImportRelevantChanges
    filename: string
    _csrfToken: any
}


export interface ConfigurationitemsImportFileInformation {
    openITCOCKPIT_version: string
    checksum: string
    commands_count: number
    timeperiods_count: number
    contacts_count: number
    contactgroups_count: number
    servicetemplates_count: number
    servicetemplategroups_count: number
}

export type ConfigurationitemsImportRelevantChanges = {
    [key in ConfigurationItemsExportImport]?: ConfigurationitemsImportChange[]
}

export interface ConfigurationitemsImportChange {
    id: number,
    name: string,
    changes: {
        [key: string]: {
            current: any[] | {
                [key: string]: any
            },
            new: any[] | {
                [key: string]: any
            }
        }
    }
}

// These interfaces are only for the template as we have to rewrite the server response
// to make ngFor happy

export type RelevantChangesByObjectTypeForGroupByType = {
    [key in ConfigurationItemsExportImport]?: ConfigurationitemsRelevantChangeForTemplate[]
}

export interface RelevantChangesByObjectTypesForTemplate {
    objectType: ConfigurationItemsExportImport,
    relevantChanges: ConfigurationitemsRelevantChangeForTemplate[]
}

export interface ConfigurationitemsRelevantChangeForTemplate {
    objectType: ConfigurationItemsExportImport,
    id: number,
    name: string,
    changes: RelevantChangeForTemplate[]
}

export interface RelevantChangeForTemplate {
    changedModelName: string // "Command" or "Custom Variables" - the field that has changed
    current: { field: string, value: any }[][] // [ [{field: "foo", value 123}, {field: "bar", value: "buzz"}] ]
    new: { field: string, value: any }[][]     // This is an array in an array so we know when a new obect starts (like if multiple custom variables got changes)
}

