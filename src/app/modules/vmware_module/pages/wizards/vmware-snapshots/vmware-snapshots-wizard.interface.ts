import { ServicetemplateForWizard, WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface VmwareSnapshotsWizardGet extends WizardGet {
    vmwareuser: string
    vmwarepass: string
    vcenter: string
    snapshotServicetemplate: ServicetemplateForWizard
}

// WIZARD POST
export interface VmwareSnapshotsWizardPost extends WizardPost {
    vmwareuser: string
    vmwarepass: string
    vcenter: string
    typeId: string
}
