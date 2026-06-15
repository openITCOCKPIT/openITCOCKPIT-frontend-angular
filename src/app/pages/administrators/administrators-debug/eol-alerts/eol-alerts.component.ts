import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
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
    public phpversion = input<string>('');

    public phpVersionInt: number = 0

    public constructor() {
        effect(() => {
            let v = this.phpversion();
            if (v) {
                let versions = v.split('.');
                if (versions.length >= 2) {
                    this.phpVersionInt = Number(`${versions[0]}${versions[1]}0`);
                }
            }
        });
    }

}
