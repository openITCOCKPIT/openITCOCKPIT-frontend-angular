import { WizardGet, WizardPost } from '../wizards.interface';


// WIZARD GET
export interface MysqlWizardGet extends WizardGet {
    username: string
    password: string
    database: string
    serverAddr: string
}


// WIZARD POST
export interface MysqlWizardPost extends WizardPost {
    username: string
    database: string
    password: string
}
