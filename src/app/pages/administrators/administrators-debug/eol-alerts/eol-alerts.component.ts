import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AlertComponent } from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { TranslocoDirective } from '@jsverse/transloco';

@Component({
    selector: 'oitc-eol-alerts',
    imports: [
    AlertComponent,
    FaIconComponent,
    TranslocoDirective
],
    templateUrl: './eol-alerts.component.html',
    styleUrl: './eol-alerts.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EolAlertsComponent {

    // The release codename such as "trusty" or "xenial"
    public codename = input<string>('');

}
