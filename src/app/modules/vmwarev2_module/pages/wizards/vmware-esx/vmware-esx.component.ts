import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { VmwareEsxWizardGet, VmwareEsxWizardPost } from './vmware-esx-wizard.interface';
import { VmwareEsxWizardService } from './vmware-esx-wizard.service';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import {
    AccordionButtonDirective,
    AccordionComponent,
    AccordionItemComponent,
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormLabelDirective,
    TemplateIdDirective
} from '@coreui/angular';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';

@Component({
    selector: 'oitc-vmware-esx',
    imports: [
        PaginatorModule,
        FormsModule,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        RouterLink,
        FaIconComponent,
        TranslocoPipe,
        BackButtonDirective,
        AccordionComponent,
        AccordionItemComponent,
        AccordionButtonDirective,
        RequiredIconComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        WizardsDynamicfieldsComponent,
        TranslocoDirective,
        TemplateIdDirective,
        FormLabelDirective,
        AlertComponent
    ],
    templateUrl: './vmware-esx.component.html',
    styleUrl: './vmware-esx.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VmwareEsxComponent extends WizardsAbstractComponent {
    protected override WizardService: VmwareEsxWizardService = inject(VmwareEsxWizardService);

    protected override post: VmwareEsxWizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
// Fields for the wizard
        vmwareuser: '',
        vmwarepass: '',
        vcenter: '',
        typeId: 'vmware-esx'
    } as VmwareEsxWizardPost;

    protected override wizardLoad(result: VmwareEsxWizardGet): void {
        this.post.vmwareuser = result.vmwareuser;
        this.post.vmwarepass = result.vmwarepass;
        this.post.vcenter = result.vcenter;
        super.wizardLoad(result);
    }
}
