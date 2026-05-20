import { SelectKeyValue, SelectKeyValueWithDisabled } from '../../../layouts/primeng/select.interface';
import { AllocatedDashboardTab } from '../../../pages/dashboardallocations/dashboard-allocations.interface';

export interface BookmarkAllocateContainerResponse {
    users: SelectKeyValue[]
    usergroups: SelectKeyValue[],
    filter_bookmarks: SelectKeyValueWithDisabled[] ;
    _csrfToken: string
}

export interface allocatedFilterbookmark {
    id?: number,
    filter_bookmark_id: number,
    container_id: number,
    name: string,
    user_id?: number,
    usergroups: {
        _ids: number[]
    }
    users: {
        _ids: number[]
    }
}

