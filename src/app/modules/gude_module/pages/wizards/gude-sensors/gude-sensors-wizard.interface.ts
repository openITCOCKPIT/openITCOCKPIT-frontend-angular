import {
    ServiceForWizard,
    ServicetemplateForWizard,
    SNMPWizardPost,
    WizardDiscovery,
    WizardDiscoveryItem,
    WizardGet
} from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface GudeSensorsWizardGet extends WizardGet {
    sensorsServicetemplateTemp: ServicetemplateForWizard
    sensorsServicetemplateHumidity: ServicetemplateForWizard
}


// WIZARD POST
export interface GudeSensorsWizardPost extends SNMPWizardPost {
    sensorServices: ServiceForWizard[]
}

// SNMP Discovery
export interface GudeSensorsSnmpDiscovery extends WizardDiscovery {
    sensors: WizardDiscoveryItem[]
}
