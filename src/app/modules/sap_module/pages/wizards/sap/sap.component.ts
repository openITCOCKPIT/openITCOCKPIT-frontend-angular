import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { SapWizardService } from './sap-wizard.service';
import { SapWizardGet, SapWizardPost } from './sap-wizard.interface';
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
    selector: 'oitc-sap',
    standalone: true,
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
        RouterLink,
        FormsModule
    ],
    templateUrl: './sap.component.html',
    styleUrl: './sap.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SapComponent extends WizardsAbstractComponent {
    protected override WizardService: SapWizardService = inject(SapWizardService);

    protected override post: SapWizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
// Fields for the wizard
        sysnr: '',
        client: '',
        rfcuser: '',
        rfcpassword: '',
        sid: '',
        msgroup: ''
    } as SapWizardPost;

    protected override wizardLoad(result: SapWizardGet): void {
        this.post.sysnr = result.sysnr;
        this.post.client = result.client;
        this.post.rfcuser = result.rfcuser;
        this.post.rfcpassword = result.rfcpassword;
        this.post.sid = result.sid;
        this.post.msgroup = result.msgroup;
        super.wizardLoad(result);
    }

}
