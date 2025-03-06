import { SelectKeyValue, SelectKeyValueWithDisabled } from '../../../../layouts/primeng/select.interface';
import { AllocatedDashboardTab } from '../../../dashboardallocations/dashboard-allocations.interface';

export interface DashboardAllocateContainerResponse {
    users: SelectKeyValue[]
    usergroups: SelectKeyValue[]
    dashboard_tabs: SelectKeyValueWithDisabled[]
    allocated_dashboard_tabs: AllocatedDashboardTab[]
    _csrfToken: string
}
