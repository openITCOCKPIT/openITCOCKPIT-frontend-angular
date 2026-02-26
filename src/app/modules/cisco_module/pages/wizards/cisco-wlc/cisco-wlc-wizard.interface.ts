import { Service, SNMPWizardPost } from '../../../../../pages/wizards/wizards.interface';


// WIZARD POST
export interface CiscoWlcWizardPost extends SNMPWizardPost {
    interfaces: Service[]
}
