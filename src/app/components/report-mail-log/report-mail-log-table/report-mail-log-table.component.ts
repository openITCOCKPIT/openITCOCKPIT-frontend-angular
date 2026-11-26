import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatSort, MatSortHeader, Sort, SortDirection } from '@angular/material/sort';
import { BadgeComponent, ContainerComponent, TableDirective } from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import { ReportMailLogEntry } from '../report-mail-log.interface';
import {
    ReportMailLogRecipientsComponent
} from '../report-mail-log-recipients/report-mail-log-recipients.component';

/**
 * Table of the central report mail log, shared by the mail log pages of all report types.
 */
@Component({
    selector: 'oitc-report-mail-log-table',
    imports: [
        BadgeComponent,
        ContainerComponent,
        MatSort,
        MatSortHeader,
        NoRecordsComponent,
        ReportMailLogRecipientsComponent,
        TableDirective,
        TranslocoDirective
    ],
    templateUrl: './report-mail-log-table.component.html',
    styleUrl: './report-mail-log-table.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportMailLogTableComponent {
    public mailLog = input.required<ReportMailLogEntry[]>();
    public sort = input<string>('ReportMailLog.send_time');
    public direction = input<SortDirection>('desc');

    public sortChange = output<Sort>();
}
