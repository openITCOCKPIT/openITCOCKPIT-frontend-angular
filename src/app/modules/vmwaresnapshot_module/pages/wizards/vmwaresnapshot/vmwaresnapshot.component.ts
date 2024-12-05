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
import { VmwareSnapshotWizardGet, VmwareSnapshotWizardPost } from './vmwaresnapshot-wizard.interface';
import { VmwaresnapshotWizardService } from './vmwaresnapshot-wizard.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';

@Component({
    selector: 'oitc-vmwaresnapshot',
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
    templateUrl: './vmwaresnapshot.component.html',
    styleUrl: './vmwaresnapshot.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VmwaresnapshotComponent extends WizardsAbstractComponent {
    private readonly VmwareSnapshotWizardService: VmwaresnapshotWizardService = inject(VmwaresnapshotWizardService);

    protected override post: VmwareSnapshotWizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
// Fields for the wizard
        password: '',
        username: '',
        vmwhost: ''
    } as VmwareSnapshotWizardPost;

    public loadWizard(): void {
        this.subscriptions.add(this.VmwareSnapshotWizardService.fetch(this.post.host_id)
            .subscribe((result: VmwareSnapshotWizardGet) => {
                this.servicetemplates = result.servicetemplates;
                this.servicesNamesForExistCheck = result.servicesNamesForExistCheck;

                this.post.password = result.password;
                this.post.username = result.username;
                this.post.vmwhost = result.vmwhost;


                // Call default stub that fills services and calls CDR.
                this.afterWizardLoaded(result);
            }));
    }

    public submit(): void {
        this.subscriptions.add(this.VmwareSnapshotWizardService.submit(this.post)
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
