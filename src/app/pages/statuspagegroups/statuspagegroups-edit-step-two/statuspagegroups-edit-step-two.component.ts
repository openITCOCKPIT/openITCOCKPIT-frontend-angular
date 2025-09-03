import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { StatuspagegroupPost } from '../statuspagegroups.interface';
import { GenericValidationError } from '../../../generic-responses';

@Component({
    selector: 'oitc-statuspagegroups-edit-step-two',
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        FormLoaderComponent
    ],
    templateUrl: './statuspagegroups-edit-step-two.component.html',
    styleUrl: './statuspagegroups-edit-step-two.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatuspagegroupsEditStepTwoComponent {

    public post?: StatuspagegroupPost;
    public errors: GenericValidationError | null = null;

}
