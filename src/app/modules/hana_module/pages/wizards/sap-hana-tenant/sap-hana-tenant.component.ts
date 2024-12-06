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
    private readonly SapHanaTenantWizardService: SapHanaTenantWizardService = inject(SapHanaTenantWizardService);

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

    public loadWizard(): void {
        this.subscriptions.add(this.SapHanaTenantWizardService.fetch(this.post.host_id)
            .subscribe((result: SapHanaTenantWizardGet) => {
                this.servicetemplates = result.servicetemplates;
                this.servicesNamesForExistCheck = result.servicesNamesForExistCheck;

                this.post.dbuser = result.dbuser;
                this.post.dbpassword = result.dbpassword;
                this.post.dbtenantport = result.dbtenantport;
                this.post.dbsystemport = result.dbsystemport;

                // Call default stub that fills services and calls CDR.
                this.afterWizardLoaded(result);
            }));
    }

    public submit(): void {
        this.subscriptions.add(this.SapHanaTenantWizardService.submit(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const title: string = this.TranslocoService.translate('Success');
                    const msg: string = this.TranslocoService.translate('Data saved successfully');

                    this.notyService.genericSuccess(msg, title);
                    this.router.navigate(['/wizards/index']);
                    return;
                }
                // Error
                this.notyService.genericError();
                const errorResponse: GenericValidationError = result.data as GenericValidationError;
                if (result) {
                    this.errors = errorResponse;

                }
            })
        );
    }

}
