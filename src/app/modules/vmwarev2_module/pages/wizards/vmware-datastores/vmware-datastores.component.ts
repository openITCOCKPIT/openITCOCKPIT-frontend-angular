import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { VmwareDatastoresWizardGet, VmwareDatastoresWizardPost } from './vmware-datastores-wizard.interface';
import { VmwareDatastoresWizardService } from './vmware-datastores-wizard.service';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import {
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormLabelDirective
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
        RequiredIconComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        WizardsDynamicfieldsComponent,
        TranslocoDirective,
        FormLabelDirective,
        AlertComponent
    ],
    templateUrl: './vmware-datastores.component.html',
    styleUrl: './vmware-datastores.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VmwareDatastoresComponent extends WizardsAbstractComponent {
    protected override WizardService: VmwareDatastoresWizardService = inject(VmwareDatastoresWizardService);

    protected override post: VmwareDatastoresWizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
// Fields for the wizard
        vmwareuser: '',
        vmwarepass: '',
        vcenter: '',
        typeId: 'vmware-datastores'
    } as VmwareDatastoresWizardPost;

    protected override wizardLoad(result: VmwareDatastoresWizardGet): void {
        this.post.vmwareuser = result.vmwareuser;
        this.post.vmwarepass = result.vmwarepass;
        this.post.vcenter = result.vcenter;
        super.wizardLoad(result);
    }
}
