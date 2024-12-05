// WIZARD GET
import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

export interface PrinterWizardGet extends WizardGet {
}

// WIZARD POST
export interface PrinterWizardPost extends WizardPost {
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
