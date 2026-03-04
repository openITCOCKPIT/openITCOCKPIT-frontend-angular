import {
    ServiceForWizard,
    ServicetemplateForWizard,
    SNMPWizardPost,
    WizardDiscovery,
    WizardDiscoveryItem,
    WizardGet
} from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface NetworkinterfacesWizardGet extends WizardGet {
    interfaceServicetemplate: ServicetemplateForWizard
}


// WIZARD POST
export interface NetworkinterfacesWizardPost extends SNMPWizardPost {
    interfaces: ServiceForWizard[]
}

// SNMP Discovery
export interface NetworkinterfacesDiscovery extends WizardDiscovery {
    interfaces: WizardDiscoveryItem[]
}
