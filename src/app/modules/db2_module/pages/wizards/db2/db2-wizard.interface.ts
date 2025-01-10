import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface Db2WizardGet extends WizardGet {
    dbuser: string
    dbpass: string
}

// WIZARD POST
export interface Db2WizardPost extends WizardPost {
    dbuser: string
    dbpass: string
}
