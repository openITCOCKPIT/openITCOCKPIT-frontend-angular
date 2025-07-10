// The DbKey is used to identify a configuration file inside and outside the database.
// Keep this in sync with GeneratorRegistry.php
// https://github.com/openITCOCKPIT/openITCOCKPIT/blob/development/src/itnovum/openITCOCKPIT/ConfigGenerator/GeneratorRegistry.php#L40
export enum ConfigurationFilesDbKeys {
    NagiosCfg = 'NagiosCfg',
    ModGearmanModule = 'ModGearmanModule',
    AfterExport = 'AfterExport',
    DbBackend = 'DbBackend',
    PerfdataBackend = 'PerfdataBackend',
    Gearman = 'Gearman',
    GraphingDocker = 'GraphingDocker',
    StatusengineCfg = 'StatusengineCfg',
    Statusengine3Cfg = 'Statusengine3Cfg',
    GraphiteWeb = 'GraphiteWeb',
    NSTAMaster = 'NSTAMaster',
    PhpFpmOitc = 'PhpFpmOitc',

    // Modules
    SnmpTrapCfgs_snmptrapd = 'SnmpTrapCfgs_snmptrapd',
    SnmpTrapCfgs_snmptrapdConf = 'SnmpTrapCfgs_snmptrapdConf',
    SnmpTrapCfgs_snmpttIni = 'SnmpTrapCfgs_snmpttIni',
    PrometheusCfgs_prometheus = 'PrometheusCfgs_prometheus'
}

export enum ConfigurationFilesFieldTypes {
    float = 'float',
    int = 'int',
    bool = 'bool',
    string = 'string',
    text = 'text'
}
