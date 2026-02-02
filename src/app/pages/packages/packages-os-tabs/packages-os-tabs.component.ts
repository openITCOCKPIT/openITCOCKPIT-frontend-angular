import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NavComponent, NavItemComponent } from '@coreui/angular';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
    selector: 'oitc-packages-os-tabs',
    imports: [
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        RouterLink,
        TranslocoDirective
    ],
    templateUrl: './packages-os-tabs.component.html',
    styleUrl: './packages-os-tabs.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackagesOsTabsComponent {

    public isActive: InputSignal<number> = input<number>(0);


}
