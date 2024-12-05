import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    AccordionButtonDirective,
    AccordionComponent,
    AccordionItemComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormLabelDirective,
    TemplateIdDirective
} from '@coreui/angular';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { VmwarehorizonWizardService } from './vmwarehorizon-wizard.service';
import { VmwarehorizonWizardGet, VmwarehorizonWizardPost } from './vmwarehorizon-wizard.interface';

@Component({
    selector: 'oitc-vmwarehorizon',
    standalone: true,
    imports: [
        RouterLink,
        FaIconComponent,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        TranslocoPipe,
        WizardsDynamicfieldsComponent,
        AccordionButtonDirective,
        AccordionComponent,
        AccordionItemComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        RequiredIconComponent,
        TemplateIdDirective,
        TranslocoDirective
    ],
    templateUrl: './vmwarehorizon.component.html',
    styleUrl: './vmwarehorizon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VmwarehorizonComponent extends WizardsAbstractComponent {
    private readonly VmwarehorizonWizardService: VmwarehorizonWizardService = inject(VmwarehorizonWizardService);

    protected override post: VmwarehorizonWizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
// Fields for the wizard
        vmwareuser: '',
        vmwarepass: '',
        vmwaredomain: ''
    } as VmwarehorizonWizardPost;

    public loadWizard(): void {
        this.subscriptions.add(this.VmwarehorizonWizardService.fetch(this.post.host_id)
            .subscribe((result: VmwarehorizonWizardGet) => {
                this.servicetemplates = result.servicetemplates;
                this.servicesNamesForExistCheck = result.servicesNamesForExistCheck;

                this.post.vmwarepass = result.vmwarepass;
                this.post.vmwareuser = result.vmwareuser;
                this.post.vmwaredomain = result.vmwaredomain;


                // Call default stub that fills services and calls CDR.
                this.afterWizardLoaded(result);
            }));
    }

    public submit(): void {
        this.subscriptions.add(this.VmwarehorizonWizardService.submit(this.post)
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
