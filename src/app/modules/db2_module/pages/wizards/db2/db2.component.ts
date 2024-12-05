import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { RouterLink } from '@angular/router';
import { Db2WizardGet, Db2WizardPost } from './db2-wizard.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { Db2WizardService } from './db2-wizard.service';

@Component({
    selector: 'oitc-db2',
    standalone: true,
    imports: [
        AccordionButtonDirective,
        AccordionComponent,
        AccordionItemComponent,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        RequiredIconComponent,
        TemplateIdDirective,
        TranslocoDirective,
        TranslocoPipe,
        WizardsDynamicfieldsComponent,
        RouterLink
    ],
    templateUrl: './db2.component.html',
    styleUrl: './db2.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Db2Component extends WizardsAbstractComponent {
    private readonly Db2WizardService: Db2WizardService = inject(Db2WizardService);

    protected override post: Db2WizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
// Fields for the wizard
        dbuser: '',
        dbpass: ''
    } as Db2WizardPost;

    public submit(): void {
        this.subscriptions.add(this.Db2WizardService.submit(this.post)
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

    public loadWizard() {
        this.subscriptions.add(this.Db2WizardService.fetch(this.post.host_id)
            .subscribe((result: Db2WizardGet) => {
                this.post.dbuser = result.dbuser;
                this.post.dbpass = result.dbpass;

                // Call default stub that fills services and calls CDR.
                this.afterWizardLoaded(result);
            }));
    }

}
