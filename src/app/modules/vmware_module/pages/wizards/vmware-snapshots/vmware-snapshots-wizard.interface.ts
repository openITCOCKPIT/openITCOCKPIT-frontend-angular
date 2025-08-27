import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';
import {
    Servicecommandargumentvalue
} from '../../../../nwc_module/pages/wizards/networkbasic/networkbasic-wizard.interface';

// WIZARD GET
export interface VmwareSnapshotsWizardGet extends WizardGet {
    vmwareuser: string
    vmwarepass: string
    vcenter: string
    snapshotServicetemplate: SnapshotServicetemplate
}

// WIZARD POST
export interface VmwareSnapshotsWizardPost extends WizardPost {
    vmwareuser: string
    vmwarepass: string
    vcenter: string
    typeId: string
}

export interface SnapshotServicetemplate {
    id: number
    uuid: string
    template_name: string
    name: string
    container_id: number
    servicetemplatetype_id: number
    check_period_id: number
    notify_period_id: number
    description: string
    command_id: number
    check_command_args: string
    checkcommand_info: string
    eventhandler_command_id: number
    timeperiod_id: number
    check_interval: number
    retry_interval: number
    max_check_attempts: number
    first_notification_delay: number
    notification_interval: number
    notify_on_warning: number
    notify_on_unknown: number
    notify_on_critical: number
    notify_on_recovery: number
    notify_on_flapping: number
    notify_on_downtime: number
    flap_detection_enabled: number
    flap_detection_on_ok: number
    flap_detection_on_warning: number
    flap_detection_on_unknown: number
    flap_detection_on_critical: number
    low_flap_threshold: number
    high_flap_threshold: number
    process_performance_data: number
    freshness_checks_enabled: number
    freshness_threshold: any
    passive_checks_enabled: number
    event_handler_enabled: number
    active_checks_enabled: number
    retain_status_information: number
    retain_nonstatus_information: number
    notifications_enabled: number
    notes: string
    priority: number
    tags: string
    service_url: any
    sla_relevant: number
    is_volatile: number
    check_freshness: number
    created: string
    modified: string
    check_command: {
        id: number
        name: string
        command_line: string
        command_type: number
        human_args: any
        uuid: string
        description: string
        commandarguments: {
            id: number
            command_id: number
            name: string
            human_name: string
            created: string
            modified: string
        }[]
    }
    servicetemplatecommandargumentvalues: Servicecommandargumentvalue[]
}
