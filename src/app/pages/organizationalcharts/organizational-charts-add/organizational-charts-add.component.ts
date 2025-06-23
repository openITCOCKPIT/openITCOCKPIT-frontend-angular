import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective
} from '@coreui/angular';
import {
    OrganizationalChartsEditorComponent
} from '../organizational-charts-editor/organizational-charts-editor.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { GenericValidationError } from '../../../generic-responses';
import { OrganizationalChartsPost, OrganizationalChartsTreeNode } from '../organizationalcharts.interface';
import { JsonPipe } from '@angular/common';

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
        RouterLink,
        FormDirective,
        FormsModule,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        RequiredIconComponent,
        JsonPipe
    ],
    templateUrl: './organizational-charts-add.component.html',
    styleUrl: './organizational-charts-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationalChartsAddComponent {

    public createAnother: boolean = false;
    public post: OrganizationalChartsPost = this.getDefaultPost();
    public errors: GenericValidationError | null = null;

    public tree: OrganizationalChartsTreeNode[] = [];

    private getDefaultPost(): OrganizationalChartsPost {
        return {
            name: '',
            description: '',
        };
    }


    public submit() {

    }
}
