import { WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD POST
export interface BroadcomBESWizardPost extends WizardPost {
    authPassword: string
    authProtocol: string
    privacyPassword: string
    privacyProtocol: string
    securityLevel: string
    securityName: string
    snmpCommunity: string
    snmpVersion: string
}
