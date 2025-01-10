import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface SapWizardGet extends WizardGet {
    sysnr: string
    client: string
    rfcuser: string
    rfcpassword: string
    sid: string
    msgroup: string
}

// WIZARD POST
export interface SapWizardPost extends WizardPost {
    sysnr: string
    client: string
    rfcuser: string
    rfcpassword: string
    sid: string
    msgroup: string
}
