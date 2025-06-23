import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardBodyComponent, CardComponent, CardHeaderComponent, CardTitleDirective } from '@coreui/angular';
import {
    OrganizationalChartsEditorComponent
} from '../organizational-charts-editor/organizational-charts-editor.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'oitc-organizational-charts-add',
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        OrganizationalChartsEditorComponent,
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink
    ],
    templateUrl: './organizational-charts-add.component.html',
    styleUrl: './organizational-charts-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationalChartsAddComponent {

}
