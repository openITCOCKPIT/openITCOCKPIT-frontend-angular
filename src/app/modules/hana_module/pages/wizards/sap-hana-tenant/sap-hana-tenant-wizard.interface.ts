import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface SapHanaTenantWizardGet extends WizardGet {
    dbuser: string
    dbpassword: string
    dbtenantport: string
    dbsystemport: string
}

// WIZARD POST
export interface SapHanaTenantWizardPost extends WizardPost {
    dbuser: string
    dbpassword: string
    dbtenantport: string
    dbsystemport: string
    typeId: string
}
