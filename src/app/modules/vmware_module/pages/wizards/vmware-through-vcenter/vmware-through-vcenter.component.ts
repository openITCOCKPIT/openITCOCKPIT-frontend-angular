import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import {
    VmwareThroughVcenterWizardGet,
    VmwareThroughVcenterWizardPost
} from './vmware-through-vcenter-wizard.interface';
import { VmwareThroughVcenterWizardService } from './vmware-through-vcenter-wizard.service';
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
import { PaginatorModule } from 'primeng/paginator';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'oitc-vmware-through-vcenter',
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
    templateUrl: './vmware-through-vcenter.component.html',
    styleUrl: './vmware-through-vcenter.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VmwareThroughVcenterComponent extends WizardsAbstractComponent {
    private readonly VmwareThroughVcenterWizardService: VmwareThroughVcenterWizardService = inject(VmwareThroughVcenterWizardService);

    protected override post: VmwareThroughVcenterWizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
// Fields for the wizard
        username: '',
        password: '',
        vcenter: '',
        typeId: 'vmware-through-vcenter'
    } as VmwareThroughVcenterWizardPost;

    public loadWizard(): void {
        this.subscriptions.add(this.VmwareThroughVcenterWizardService.fetch(this.post.host_id)
            .subscribe((result: VmwareThroughVcenterWizardGet) => {
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
        this.subscriptions.add(this.VmwareThroughVcenterWizardService.submit(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const title: string = this.TranslocoService.translate('Success');
                    const msg: string = this.TranslocoService.translate('Data saved successfully');

                    this.notyService.genericSuccess(msg, title);
                    this.router.navigate(['/services/notMonitored']);
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