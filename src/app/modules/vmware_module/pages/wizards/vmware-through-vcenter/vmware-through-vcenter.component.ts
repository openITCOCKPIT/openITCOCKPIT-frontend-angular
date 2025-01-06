import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
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
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'oitc-vmware-through-vcenter',
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
        FormsModule
    ],
    templateUrl: './vmware-through-vcenter.component.html',
    styleUrl: './vmware-through-vcenter.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VmwareThroughVcenterComponent extends WizardsAbstractComponent {
    protected override WizardService: VmwareThroughVcenterWizardService = inject(VmwareThroughVcenterWizardService);

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

    protected override wizardLoad(result: VmwareThroughVcenterWizardGet): void {
        this.post.username = result.username;
        this.post.password = result.password;
        this.post.vcenter = result.vcenter;
        super.wizardLoad(result);
    }

}