import { ServicetemplateForWizard, WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface ProxmoxStorageWizardGet extends WizardGet {
    pveUsername: string
    pveApiTokenName: string
    pveApiTokenSecret: string
    pveNodeName: string
    pvePort: number,
    storageServicetemplate: ServicetemplateForWizard
}


// WIZARD POST
export interface ProxmoxStorageWizardPost extends WizardPost {
    pveUsername: string
    pveApiTokenName: string
    pveApiTokenSecret: string
    pveNodeName: string
    pvePort: number
}


export interface ProxmoxStoragesWizardPost {
    host_id: number
}

export interface StorageDiscovery {
}
