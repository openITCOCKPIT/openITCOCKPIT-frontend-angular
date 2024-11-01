import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';

/**********************
 *    Export action   *
 **********************/

export interface ConfigurationitemsElementsExportPost {
    Configurationitems: {
        commands: {
            _ids: number[]
        },
        timeperiods: {
            _ids: number[]
        },
        contacts: {
            _ids: number[]
        },
        contactgroups: {
            _ids: number[]
        },
        servicetemplates: {
            _ids: number[]
        },
        servicetemplategroups: {
            _ids: number[]
        }
    }
}


export interface ConfigurationitemsElementsExport {
    commands: SelectKeyValue[]
    timeperiods: SelectKeyValue[]
    contacts: SelectKeyValue[]
    contactgroups: SelectKeyValue[]
    servicetemplates: SelectKeyValue[]
    servicetemplategroups: SelectKeyValue[]
}

// The objects get JSON encoded and written into a file.
// TypeScript itself does not use the data at all. For this reason, we used any[] for the properties.
export interface ConfigurationitemsElementsJsonFile {
    export: {
        servicetemplategroups: any[]
        servicetemplates: any[]
        contactgroups: any[]
        contacts: any[]
        timeperiods: any[]
        commands: any[]
    }

    checksum: string,
    success: boolean,
    OPENITCOCKPIT_VERSION: string
}
