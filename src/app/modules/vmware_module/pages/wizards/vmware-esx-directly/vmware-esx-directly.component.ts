import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { VmwareEsxDirectlyWizardGet, VmwareEsxDirectlyWizardPost } from './vmware-esx-directly-wizard.interface';
import { VmwareEsxDirectlyWizardService } from './vmware-esx-directly-wizard.service';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormLabelDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { PaginatorModule } from 'primeng/paginator';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'oitc-vmware-esx-directly',
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
        PaginatorModule,
        RequiredIconComponent,
        TranslocoDirective,
        TranslocoPipe,
        WizardsDynamicfieldsComponent,
        RouterLink
    ],
    templateUrl: './vmware-esx-directly.component.html',
    styleUrl: './vmware-esx-directly.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VmwareEsxDirectlyComponent extends WizardsAbstractComponent {
    private readonly VmwareEsxDirectlyWizardService: VmwareEsxDirectlyWizardService = inject(VmwareEsxDirectlyWizardService);

    protected override post: VmwareEsxDirectlyWizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
// Fields for the wizard
        username: '',
        password: '',
        vcenter: '',
        typeId: 'vmware-esx-directly'
    } as VmwareEsxDirectlyWizardPost;

    public loadWizard(): void {
        this.subscriptions.add(this.VmwareEsxDirectlyWizardService.fetch(this.post.host_id)
            .subscribe((result: VmwareEsxDirectlyWizardGet) => {
                this.servicetemplates = result.servicetemplates;
                this.servicesNamesForExistCheck = result.servicesNamesForExistCheck;

                this.post.username = result.username;
                this.post.password = result.password;
                this.post.vcenter = result.vcenter;

                // Call default stub that fills services and calls CDR.
                this.afterWizardLoaded(result);
            }));
    }

    public submit(): void {
        this.subscriptions.add(this.VmwareEsxDirectlyWizardService.submit(this.post)
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
