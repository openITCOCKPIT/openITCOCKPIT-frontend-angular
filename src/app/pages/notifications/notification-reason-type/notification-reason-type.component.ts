import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NotificationReasonTypesEnum } from '../notification-reason-types.enum';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
    selector: 'oitc-notification-reason-type',
    imports: [
        TranslocoDirective
    ],
    templateUrl: './notification-reason-type.component.html',
    styleUrl: './notification-reason-type.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationReasonTypeComponent {

    public reasonType = input<NotificationReasonTypesEnum>();


    protected readonly NotificationReasonTypesEnum = NotificationReasonTypesEnum;
}
