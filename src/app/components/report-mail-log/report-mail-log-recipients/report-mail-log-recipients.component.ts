import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { ReportMailLogRecipient } from '../report-mail-log.interface';

/**
 * List of the recipients of one report mail log entry.
 * Existing users are linked, deleted users are marked as deleted.
 */
@Component({
    selector: 'oitc-report-mail-log-recipients',
    imports: [
        FaIconComponent,
        LabelLinkComponent,
        NgTemplateOutlet,
        TranslocoDirective,
        TranslocoPipe
    ],
    templateUrl: './report-mail-log-recipients.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportMailLogRecipientsComponent {
    public recipients = input.required<ReportMailLogRecipient[]>();
}
