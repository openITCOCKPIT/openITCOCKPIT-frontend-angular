import { ConfigurationFilesDbKeys, ConfigurationFilesFieldTypes } from './configuration-files.enum';

/**********************
 *    Index action    *
 **********************/
export interface ConfigurationFilesIndexRoot {
    configFileCategories: ConfigurationFilesConfigFileCategory[]
    IS_CONTAINER: boolean
    _csrfToken: string
}

export interface ConfigurationFilesConfigFileCategory {
    name: string
    configFiles: ConfigurationFilesConfigFile[]
}

export interface ConfigurationFilesConfigFile {
    linkedOutfile: string
    dbKey: ConfigurationFilesDbKeys
}

/**********************
 *    Edit action     *
 **********************/

export interface ConfigurationFileInformation {
    linkedOutfile: string,
    realOutfile: string,
    dbKey: ConfigurationFilesDbKeys,

    // By default, we load configuration files from the core API endpoint.
    // Some config files are provided by a module, of moduleUrl is set, this is the URL prefix we need to use
    // for example "prometheus_module"
    moduleUrl: null | string,

    // in the AngularJS days we used this to dynamically load the directive. This is no longer possible in Angular.
    // instead we use a switch case now, but we use the dbKey instead of the directive name so we don't have to define
    // the data twice.
    // So angularDirective is deprecated and should be removed in the future.
    angularDirective: string
}

export interface ConfigurationEditorRootResponse {
    config: ConfigurationEditorConfig
    fields: ConfigurationEditorField[]
    _csrfToken: string
}

export type ConfigurationEditorConfig = {
    [key in ConfigurationFilesFieldTypes]?: {
        [key: string]: string | number
    }
}

export interface ConfigurationEditorField {
    type: ConfigurationFilesFieldTypes
    field: string // e.g. "username"
    value: string | number // e.g. "naemon"
    placeholder: string | number // e.g. "naemon"
    help: string // e.g. "The username of the Monitoring Engine"
}
