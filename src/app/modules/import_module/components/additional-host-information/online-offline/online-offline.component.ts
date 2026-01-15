import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BadgeComponent } from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
    selector: 'oitc-online-offline',
    imports: [
        BadgeComponent,
        TranslocoDirective
    ],
    templateUrl: './online-offline.component.html',
    styleUrl: './online-offline.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnlineOfflineComponent {
    @Input() public isOnline: boolean = false;
}
