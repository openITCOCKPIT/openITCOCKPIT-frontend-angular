import { ServiceForWizard, SNMPWizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD POST
export interface FortigateFirewallWizardPost extends SNMPWizardPost {
    interfaces: ServiceForWizard[]
}
