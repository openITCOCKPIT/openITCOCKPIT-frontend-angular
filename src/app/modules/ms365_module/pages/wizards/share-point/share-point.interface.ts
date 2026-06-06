import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface Ms365SharePointWizardGet extends WizardGet {
    tenantId: string
    clientId: string
    clientSecret: string
}


// WIZARD POST
export interface Ms365SharePointWizardPost extends WizardPost {
    tenantId: string
    clientId: string
    clientSecret: string
}

export interface Ms365SharePointWizardPost {
    host_id: number
}
