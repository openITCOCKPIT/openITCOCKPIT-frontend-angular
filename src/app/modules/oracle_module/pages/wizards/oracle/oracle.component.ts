import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { OracleWizardService } from './oracle-wizard.service';
import { OracleWizardGet, OracleWizardPost } from './oracle-wizard.interface';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective, FormLabelDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { RouterLink } from '@angular/router';
import { MssqlWizardGet } from '../../../../mssql_module/pages/wizards/mssql/mssql-wizard.interface';

@Component({
    selector: 'oitc-oracle',
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        ReactiveFormsModule,
        RequiredIconComponent,
        TranslocoDirective,
        TranslocoPipe,
        WizardsDynamicfieldsComponent,
        FormsModule,
        RouterLink
    ],
    templateUrl: './oracle.component.html',
    styleUrl: './oracle.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OracleComponent extends WizardsAbstractComponent {
    protected override WizardService: OracleWizardService = inject(OracleWizardService);

    protected override post: OracleWizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
// Fields for the wizard
        dbuser: '',
        dbpass: ''
    } as OracleWizardPost;

    protected override wizardLoad(result: OracleWizardGet): void {
        this.post.dbuser = result.dbuser;
        this.post.dbpass = result.dbpass;
        super.wizardLoad(result);
    }
}
