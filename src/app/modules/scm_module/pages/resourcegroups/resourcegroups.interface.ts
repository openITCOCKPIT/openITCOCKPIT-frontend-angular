import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { UserIdAndUsername } from '../../../../pages/users/users.interface';
import { ContainerEntity } from '../../../../pages/containers/containers.interface';
import {
    ScmNotificationLogRecipientTypesEnum,
    ScmNotificationLogTypesEnum
} from './resourcegroups-notifications/scm-notification-log-types.enum';
import { Resource } from '../resources/resources.interface';
import { GenericIdAndName } from '../../../../generic.interfaces';
import { getUserDate } from '../../../../services/timezone.service';

export interface ResourcegroupsIndex extends PaginateOrScroll {
    all_resourcegroups: Resourcegroup[]
    _csrfToken: string
}

export interface Resourcegroup {
    id: number
    container_id: number
    description: string
    last_state: number
    last_update: string
    last_update_failed: boolean
    last_send_date: string
    last_send_state: number
    created?: string
    modified: string
    resources: Resource[]
    container: ContainerEntity
    allow_edit: boolean
    users: UserIdAndUsername[]
    managers: UserIdAndUsername[]
    region_managers: UserIdAndUsername[]
    mailinglist_users: GenericIdAndName[]
    mailinglist_managers: GenericIdAndName[]
    mailinglist_region_managers: GenericIdAndName[]
    resource_count: number
    statesummary: number[]
}

export interface ResourcegroupsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Resourcegroups.id][]': number[],
    'filter[Containers.name]': string
    'filter[Resourcegroups.description]': string
}


export function getResourcegroupsIndexParams(): ResourcegroupsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Containers.name',
        page: 1,
        direction: 'asc',
        'filter[Resourcegroups.id][]': [],
        'filter[Containers.name]': '',
        'filter[Resourcegroups.description]': ''
    }
}

export interface ResourcegroupsGet {
    resourcegroup: {
        Resourcegroup: ResourcegroupsPost
    }
}


export interface ResourcegroupsPost {
    id?: number
    description: string
    container: {
        parent_id: number | null
        name: string
    }
    users: {
        _ids: number[]
    },
    managers: {
        _ids: number[]
    },
    region_managers: {
        _ids: number[]
    },
    mailinglists_users: {
        _ids: number[]
    },
    mailinglists_managers: {
        _ids: number[]
    },
    mailinglists_region_managers: {
        _ids: number[]
    }
}

export interface ResourcegroupWithRelations {
    id: number
    container_id: number
    description: string
    last_state: number
    last_update: string
    last_send_date: string
    last_send_state: number
    created: string
    modified: string
    resources: Resource[]
    container: ContainerEntity
}

export interface ResourcegroupsNotificationsParams {
    angular: boolean
    scroll: boolean
    sort: string
    page: number
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[ScmNotificationsLog.created]': string
    'filter[ScmNotificationsLog.reason_type][]': number[]
    'filter[recipient]': string
    'filter[from]': Date | string
    'filter[to]': Date | string
}

export function getResourcegroupsNotificationsParams(): ResourcegroupsNotificationsParams {
    let now: Date = getUserDate();
    return {
        angular: true,
        scroll: true,
        sort: 'ScmNotificationsLog.created',
        page: 1,
        direction: 'desc',
        'filter[ScmNotificationsLog.created]': '',
        'filter[ScmNotificationsLog.reason_type][]': [],
        'filter[recipient]': '',
        'filter[from]': new Date(now.getTime() - (3600 * 24 * 30 * 4 * 1000)),
        'filter[to]': new Date(now.getTime() + (3600 * 24 * 5 * 1000)),
    };
}

export interface ResourcegroupsNotifications extends PaginateOrScroll {
    resourcegroup: Resourcegroup
    notifications: ResourcegroupNotification[]
    _csrfToken: any
}

export interface ResourcegroupNotification {
    id: number
    resourcegroup_id: number
    object_type: ScmNotificationLogRecipientTypesEnum.USER | ScmNotificationLogRecipientTypesEnum.MAILINGLIST
    object_id: number
    reason_type: number
    send_time: string
    json_data: ResourcegroupNotificationJson[]
    has_been_sent: number
    error_message: any
    created: string
    recipient: string
    unconfirmed_resources: Resource[]
    confirmed_resources: Resource[]
}

export interface ResourcegroupNotificationJson {
    id: number
    name: string
    resourcegroup_id: number
    status: number
}


export interface ResourcegroupNotificationReasonTypes {
    reminder: number
    escalation: number
    status_report: number
    cumulative_status_report: number
}


export function getNotificationReasonTypesForApi(reasonType: ResourcegroupNotificationReasonTypes): number[] {
    let result = [];
    if (reasonType.reminder) {
        result.push(ScmNotificationLogTypesEnum.REMINDER);
    }
    if (reasonType.escalation) {
        result.push(ScmNotificationLogTypesEnum.ESCALATION);
    }
    if (reasonType.status_report) {
        result.push(ScmNotificationLogTypesEnum.STATUS_OVERVIEW);
    }
    if (reasonType.cumulative_status_report) {
        result.push(ScmNotificationLogTypesEnum.CUMULATIVE_STATUS_SUMMARY);
    }
    return result;
}
