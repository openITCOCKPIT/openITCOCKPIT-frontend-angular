import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface RedfishWizardGet extends WizardGet {
    REDFISH_USER: string
    REDFISH_PASS: string
}

// WIZARD POST
export interface RedfishWizardPost extends WizardPost {
    REDFISH_USER: string
    REDFISH_PASS: string
}
