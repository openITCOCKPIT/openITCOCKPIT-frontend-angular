import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface UpsWizardGet extends WizardGet {
}

// WIZARD POST
export interface UpsWizardPost extends WizardPost {
    authPassword: string
    authProtocol: string
    interfaces: any[]
    privacyPassword: string
    privacyProtocol: string
    securityLevel: string
    securityName: string
    snmpCommunity: string
    snmpVersion: string
}
