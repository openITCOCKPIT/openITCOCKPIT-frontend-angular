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
    private readonly SapWizardService: SapWizardService = inject(SapWizardService);

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

    public loadWizard(): void {
        this.subscriptions.add(this.SapWizardService.fetch(this.post.host_id)
            .subscribe((result: SapWizardGet) => {
                this.servicetemplates = result.servicetemplates;
                this.servicesNamesForExistCheck = result.servicesNamesForExistCheck;

                this.post.sysnr = result.sysnr;
                this.post.client = result.client;
                this.post.rfcuser = result.rfcuser;
                this.post.rfcpassword = result.rfcpassword;
                this.post.sid = result.sid;
                this.post.msgroup = result.msgroup;

                // Call default stub that fills services and calls CDR.
                this.afterWizardLoaded(result);
            }));
    }

    public submit(): void {
        this.subscriptions.add(this.SapWizardService.submit(this.post)
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
