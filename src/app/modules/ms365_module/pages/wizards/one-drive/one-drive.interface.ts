import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface Ms365OneDriveWizardGet extends WizardGet {
    tenantId: string
    clientId: string
    clientSecret: string
}


// WIZARD POST
export interface Ms365OneDriveWizardPost extends WizardPost {
    tenantId: string
    clientId: string
    clientSecret: string
}

export interface Ms365OneDriveWizardPost {
    host_id: number
}
