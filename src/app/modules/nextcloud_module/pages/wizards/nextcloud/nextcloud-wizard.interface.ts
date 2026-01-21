import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface NextcloudWizardGet extends WizardGet {
    NEXTCLOUD_TOKEN: string
}

// WIZARD POST
export interface NextcloudWizardPost extends WizardPost {
    NEXTCLOUD_TOKEN: string
}
