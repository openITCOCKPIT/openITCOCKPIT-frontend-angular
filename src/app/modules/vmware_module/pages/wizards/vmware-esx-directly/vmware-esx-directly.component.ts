import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { VmwareEsxDirectlyWizardGet, VmwareEsxDirectlyWizardPost } from './vmware-esx-directly-wizard.interface';
import { VmwareEsxDirectlyWizardService } from './vmware-esx-directly-wizard.service';
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
import { PaginatorModule } from 'primeng/paginator';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { BadgeOutlineComponent } from '../../../../../layouts/coreui/badge-outline/badge-outline.component';

@Component({
    selector: 'oitc-vmware-esx-directly',
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
        RouterLink,
        FormsModule,
        AccordionButtonDirective,
        AccordionComponent,
        AccordionItemComponent,
        TemplateIdDirective,
        BackButtonDirective,
        BadgeOutlineComponent
    ],
    templateUrl: './vmware-esx-directly.component.html',
    styleUrl: './vmware-esx-directly.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VmwareEsxDirectlyComponent extends WizardsAbstractComponent {
    protected override WizardService: VmwareEsxDirectlyWizardService = inject(VmwareEsxDirectlyWizardService);

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

    protected override wizardLoad(result: VmwareEsxDirectlyWizardGet): void {
        this.post.username = result.username;
        this.post.password = result.password;
        this.post.vcenter = result.vcenter;
        super.wizardLoad(result);
    }
}
