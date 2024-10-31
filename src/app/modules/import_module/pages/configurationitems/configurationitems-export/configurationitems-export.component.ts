import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'oitc-configurationitems-export',
    standalone: true,
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink
    ],
    templateUrl: './configurationitems-export.component.html',
    styleUrl: './configurationitems-export.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigurationitemsExportComponent {

}
