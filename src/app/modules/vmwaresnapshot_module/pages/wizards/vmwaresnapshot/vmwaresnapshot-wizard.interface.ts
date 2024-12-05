// WIZARD GET
import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

export interface VmwareSnapshotWizardGet extends WizardGet {
    vmwhost: string
    username: string
    password: string
}

// WIZARD POST
export interface VmwareSnapshotWizardPost extends WizardPost {
    password: string
    username: string
    vmwhost: string
}
