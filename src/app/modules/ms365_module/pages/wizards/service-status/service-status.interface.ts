import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface Ms365ServiceStatusWizardGet extends WizardGet {
    tenantId: string
    clientId: string
    clientSecret: string
}


// WIZARD POST
export interface Ms365ServiceStatusWizardPost extends WizardPost {
    tenantId: string
    clientId: string
    clientSecret: string
}

export interface Ms365ServiceStatusWizardPost {
    host_id: number
}

export interface Ms365ServiceDiscovery {
}
