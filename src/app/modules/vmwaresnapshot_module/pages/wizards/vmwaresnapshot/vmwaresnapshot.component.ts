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
import { MysqlWizardGet } from '../../../../../pages/wizards/mysqlserver/mysqlserver-wizard.interface';

@Component({
    selector: 'oitc-vmwaresnapshot',
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
    protected override WizardService: VmwaresnapshotWizardService = inject(VmwaresnapshotWizardService);

    protected override post: VmwareSnapshotWizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
// Fields for the wizard
        password: '',
        username: '',
        vmwhost: ''
    } as VmwareSnapshotWizardPost;

    protected override wizardLoad(result: VmwareSnapshotWizardGet): void {
        this.post.password = result.password;
        this.post.username = result.username;
        this.post.vmwhost = result.vmwhost;
        super.wizardLoad(result);
    }

}
