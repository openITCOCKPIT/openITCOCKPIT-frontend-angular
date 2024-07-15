// List of all supported external commands by the /cmd/submit_bulk_naemon API
// https://github.com/it-novum/openITCOCKPIT/blob/development/plugins/NagiosModule/src/Controller/CmdController.php
export enum ExternalCommandsEnum {
    rescheduleHost = "rescheduleHost",
    rescheduleService = "rescheduleService",
    submitHostDowntime = "submitHostDowntime",
    submitServiceDowntime = "submitServiceDowntime",
    submitHoststateAck = "submitHoststateAck",
    submitServicestateAck = "submitServicestateAck",
    commitPassiveServiceResult = "commitPassiveServiceResult",
    commitPassiveResult = "commitPassiveResult",
    sendCustomServiceNotification = "sendCustomServiceNotification",
    sendCustomHostNotification = "sendCustomHostNotification",
    enableOrDisableHostFlapdetection = "enableOrDisableHostFlapdetection",
    enableOrDisableServiceFlapdetection = "enableOrDisableServiceFlapdetection",
    submitEnableHostNotifications = "submitEnableHostNotifications",
    submitDisableHostNotifications = "submitDisableHostNotifications",
    submitDisableServiceNotifications = "submitDisableServiceNotifications",
    submitEnableServiceNotifications = "submitEnableServiceNotifications"
}
