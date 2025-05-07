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
import { VmwarehorizonWizardService } from './vmwarehorizon-wizard.service';
import { VmwarehorizonWizardGet, VmwarehorizonWizardPost } from './vmwarehorizon-wizard.interface';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';

@Component({
    selector: 'oitc-vmwarehorizon',
    imports: [
        RouterLink,
        FaIconComponent,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        TranslocoPipe,
        WizardsDynamicfieldsComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        RequiredIconComponent,
        TranslocoDirective,
        AccordionButtonDirective,
        AccordionComponent,
        AccordionItemComponent,
        TemplateIdDirective,
        BackButtonDirective
    ],
    templateUrl: './vmwarehorizon.component.html',
    styleUrl: './vmwarehorizon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VmwarehorizonComponent extends WizardsAbstractComponent {
    protected override WizardService: VmwarehorizonWizardService = inject(VmwarehorizonWizardService);

    protected override post: VmwarehorizonWizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
// Fields for the wizard
        vmwareuser: '',
        vmwarepass: '',
        vmwaredomain: ''
    } as VmwarehorizonWizardPost;

    protected override wizardLoad(result: VmwarehorizonWizardGet): void {
        this.post.vmwarepass = result.vmwarepass;
        this.post.vmwareuser = result.vmwareuser;
        this.post.vmwaredomain = result.vmwaredomain;
        super.wizardLoad(result);
    }

}
