import {
    DiscoveryItem,
    Service,
    Servicetemplate,
    SnmpDiscovery,
    SNMPWizardPost,
    WizardGet
} from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface GudeSensorsWizardGet extends WizardGet {
    sensorsServicetemplateTemp: Servicetemplate
    sensorsServicetemplateHumidity: Servicetemplate
}


// WIZARD POST
export interface GudeSensorsWizardPost extends SNMPWizardPost {
    sensorServices: Service[]
}

// SNMP Discovery
export interface GudeSensorsSnmpDiscovery extends SnmpDiscovery {
    sensors: DiscoveryItem[]
}
