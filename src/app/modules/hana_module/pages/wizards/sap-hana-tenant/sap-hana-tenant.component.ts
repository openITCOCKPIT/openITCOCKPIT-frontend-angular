import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { SapHanaTenantWizardService } from './sap-hana-tenant-wizard.service';
import { SapHanaTenantWizardGet, SapHanaTenantWizardPost } from './sap-hana-tenant-wizard.interface';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormLabelDirective
} from '@coreui/angular';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { MssqlWizardGet } from '../../../../mssql_module/pages/wizards/mssql/mssql-wizard.interface';

@Component({
    selector: 'oitc-sap-hana-tenant',
    standalone: true,
    imports: [
        RouterLink,
        FaIconComponent,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        CardTitleDirective,
        TranslocoPipe,
        RequiredIconComponent,
        FormLabelDirective,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormsModule,
        WizardsDynamicfieldsComponent,
        TranslocoDirective
    ],
    templateUrl: './sap-hana-tenant.component.html',
    styleUrl: './sap-hana-tenant.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SapHanaTenantComponent extends WizardsAbstractComponent {
    protected override WizardService: SapHanaTenantWizardService = inject(SapHanaTenantWizardService);

    protected override post: SapHanaTenantWizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
// Fields for the wizard
        dbuser: '',
        dbpassword: '',
        dbtenantport: '',
        dbsystemport: '',
        typeId: 'sap-hana-tenant'
    } as SapHanaTenantWizardPost;

    protected override wizardLoad(result: SapHanaTenantWizardGet): void {
        this.post.dbuser = result.dbuser;
        this.post.dbpassword = result.dbpassword;
        this.post.dbtenantport = result.dbtenantport;
        this.post.dbsystemport = result.dbsystemport;
        super.wizardLoad(result);
    }
}
