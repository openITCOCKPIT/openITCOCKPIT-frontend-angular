import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface AgentlessWindowsWizardGet extends WizardGet {
    winrmuser: string
    winrmpass: string
    winrmauthtype: string
}

// WIZARD POST
export interface AgentlessWindowsWizardPost extends WizardPost {
    winrmuser: string
    winrmpass: string
    winrmauthtype: string
}
