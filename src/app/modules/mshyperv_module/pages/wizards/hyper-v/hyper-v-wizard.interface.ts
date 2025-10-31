import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface HyperVWizardGet extends WizardGet {
    winRmUser: string
    winRmPw: string
    winRmAuthMode: string
}

// WIZARD POST
export interface HyperVWizardPost extends WizardPost {
    winRmUser: string
    winRmPw: string
    winRmAuthMode: string
}
