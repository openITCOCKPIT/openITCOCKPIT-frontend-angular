import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import {
    AccordionButtonDirective, AccordionComponent, AccordionItemComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective, FormControlDirective, FormLabelDirective, TemplateIdDirective
} from '@coreui/angular';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { PrinterWizardService } from './printer-wizard.service';
import { PrinterWizardGet, PrinterWizardPost } from './printer-wizard.interface';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';

@Component({
    selector: 'oitc-printer',
    standalone: true,
    imports: [
        FaIconComponent,
        TranslocoDirective,
        RouterLink,
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
        TemplateIdDirective
    ],
    templateUrl: './printer.component.html',
    styleUrl: './printer.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrinterComponent extends WizardsAbstractComponent {
    private readonly PrinterWizardService: PrinterWizardService = inject(PrinterWizardService);

    protected override post: PrinterWizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
// Fields for the wizard
        authPassword: '',
        authProtocol: '',
        interfaces: [],
        privacyPassword: '',
        privacyProtocol: '',
        securityLevel: '',
        securityName: '',
        snmpCommunity: '',
        snmpVersion: ''
    } as PrinterWizardPost;

    public submit(): void {
        this.subscriptions.add(this.PrinterWizardService.submit(this.post)
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

    public loadWizard() {
        this.subscriptions.add(this.PrinterWizardService.fetch(this.post.host_id)
            .subscribe((result: PrinterWizardGet) => {
                this.servicetemplates = result.servicetemplates;
                this.servicesNamesForExistCheck = result.servicesNamesForExistCheck;

                // Call default stub that fills services and calls CDR.
                this.afterWizardLoaded(result);
            }));
    }
}
