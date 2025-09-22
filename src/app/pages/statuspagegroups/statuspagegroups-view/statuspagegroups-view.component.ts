import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { StatuspagegroupsViewerComponent } from '../statuspagegroups-viewer/statuspagegroups-viewer.component';
import { CardBodyComponent, CardComponent, CardHeaderComponent } from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
    selector: 'oitc-statuspagegroups-view',
    imports: [
        RouterLink,
        FaIconComponent,
        PermissionDirective,
        StatuspagegroupsViewerComponent,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        TranslocoDirective
    ],
    templateUrl: './statuspagegroups-view.component.html',
    styleUrl: './statuspagegroups-view.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatuspagegroupsViewComponent {

}
