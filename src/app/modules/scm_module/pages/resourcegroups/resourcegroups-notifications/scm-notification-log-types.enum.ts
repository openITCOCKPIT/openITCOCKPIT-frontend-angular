export enum ScmNotificationLogTypesEnum {
    'REMINDER' = 1 << 0,
    'ESCALATION' = 1 << 1,
    'STATUS_OVERVIEW' = 1 << 2,
    'CUMULATIVE_STATUS_SUMMARY' = 1 << 3,
}

export enum ScmNotificationLogRecipientTypesEnum {
    'USER' = 'user',
    'MAILINGLIST' = 'mailinglist'
}
