import {
    ServiceForWizard,
    ServicetemplateForWizard,
    SNMPWizardPost,
    WizardDiscovery,
    WizardDiscoveryItem,
    WizardGet
} from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface NetworkbasicWizardGet extends WizardGet {
    interfaceServicetemplate: ServicetemplateForWizard
}

// WIZARD POST
export interface NetworkbasicWizardPost extends SNMPWizardPost {
    interfaces: ServiceForWizard[]
}

// SNMP Discovery
export interface NetworkbasicInterfacesDiscovery extends WizardDiscovery {
    interfaces: WizardDiscoveryItem[]
}
