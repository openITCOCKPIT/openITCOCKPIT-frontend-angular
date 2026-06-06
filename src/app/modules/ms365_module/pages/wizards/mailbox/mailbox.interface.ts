import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface Ms365MailboxWizardGet extends WizardGet {
    tenantId: string
    clientId: string
    clientSecret: string
}


// WIZARD POST
export interface Ms365MailboxWizardPost extends WizardPost {
    tenantId: string
    clientId: string
    clientSecret: string
}

export interface Ms365MailboxWizardPost {
    host_id: number
}
