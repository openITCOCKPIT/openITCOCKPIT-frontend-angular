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

// Angular can NOT handle hashmaps in the template, so we need to rewirte all the ImportChanges into arrays
// For grouping by object type in TypeScript
export type RelevantChangesAsObject = {
    [key in ConfigurationItemsExportImport]?: RelevantObjectChanges[]
}

// For ngFor in the template
export type RelevantChangesAsArray = {
    objectType: ConfigurationItemsExportImport
    relevantObjects: RelevantObjectChanges[]
}

export interface RelevantObjectChanges {
    id: number
    name: string
    modelChanges: ModelChange[]
}

export interface ModelChange {
    modelName: string,
    current: { key: string, value: any }[][]
    new: { key: string, value: any }[][]
}
