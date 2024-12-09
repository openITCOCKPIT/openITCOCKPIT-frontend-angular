import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
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
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormsModule } from '@angular/forms';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { SapHanaSystemWizardService } from './sap-hana-system-wizard.service';
import { SapHanaSystemWizardGet, SapHanaSystemWizardPost } from './sap-hana-system-wizard.interface';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';

@Component({
    selector: 'oitc-sap-hana-system',
    standalone: true,
    imports: [
        TranslocoDirective,
        RouterLink,
        FaIconComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        FormErrorDirective,
        FormsModule,
        FormControlDirective,
        FormFeedbackComponent,
        WizardsDynamicfieldsComponent,
        RequiredIconComponent,
        FormLabelDirective,
        TranslocoPipe
    ],
    templateUrl: './sap-hana-system.component.html',
    styleUrl: './sap-hana-system.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SapHanaSystemComponent extends WizardsAbstractComponent {
    private readonly SapHanaSystemWizardService: SapHanaSystemWizardService = inject(SapHanaSystemWizardService);

    protected override post: SapHanaSystemWizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
// Fields for the wizard
        dbuser: '',
        dbpassword: '',
        dbtenantport: '',
        dbsystemport: '',
        typeId: 'sap-hana-system'
    } as SapHanaSystemWizardPost;

    public loadWizard(): void {
        this.subscriptions.add(this.SapHanaSystemWizardService.fetch(this.post.host_id)
            .subscribe((result: SapHanaSystemWizardGet) => {
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
        this.subscriptions.add(this.SapHanaSystemWizardService.submit(this.post)
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
