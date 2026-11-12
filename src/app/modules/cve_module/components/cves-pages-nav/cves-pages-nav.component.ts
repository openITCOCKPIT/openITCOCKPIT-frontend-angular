import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NavComponent, NavItemComponent } from '@coreui/angular';
import { PermissionDirective } from '../../../../permissions/permission.directive';

export type CvesPage = 'index' | 'cves' | 'software' | 'recommendations' | 'decisions';

/**
 * Buttons in the card header to switch between the overviews of the CVE module
 */
@Component({
    selector: 'oitc-cves-pages-nav',
    imports: [
        RouterLink,
        TranslocoDirective,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        PermissionDirective
    ],
    templateUrl: './cves-pages-nav.component.html',
    styleUrl: './cves-pages-nav.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvesPagesNavComponent {
    public active = input<CvesPage | null>(null);
}
