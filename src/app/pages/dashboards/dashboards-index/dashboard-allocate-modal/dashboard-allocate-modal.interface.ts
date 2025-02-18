import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';

export interface DashboardAllocateContainerResponse {
    users: SelectKeyValue[]
    usergroups: SelectKeyValue[]
    dashboard_tabs: SelectKeyValue[]
    allocated_dashboard_tabs: {
        id: number
        dashboard_tab_id: number
    }[]
    _csrfToken: string
}
