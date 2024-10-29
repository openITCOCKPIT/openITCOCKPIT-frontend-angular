import { ConfigurationFilesDbKeys } from './configuration-files.enum';

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

    // in the AngularJS days we used this to dynamically load the directive. This is no longer possible in Angular.
    // instead we use a switch case now, but we use the dbKey instead of the directive name so we don't have to define
    // the data twice.
    // So angularDirective is deprecated and should be removed in the future.
    angularDirective: string
}
