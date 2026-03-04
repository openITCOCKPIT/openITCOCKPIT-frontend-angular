import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { AgentlessWindowsWizardGet, AgentlessWindowsWizardPost } from './agentless-windows-wizard.interface';
import { AgentlessWindowsWizardService } from './agentless-windows-wizard.service';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
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
import { SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';

@Component({
    selector: 'oitc-agentless-windows',
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
        AccordionButtonDirective,
        AccordionComponent,
        AccordionItemComponent,
        TemplateIdDirective,
        SelectComponent
    ],
    templateUrl: './agentless-windows.component.html',
    styleUrl: './agentless-windows.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentlessWindowsComponent extends WizardsAbstractComponent {
    protected override WizardService: AgentlessWindowsWizardService = inject(AgentlessWindowsWizardService);

    protected override post: AgentlessWindowsWizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
// Fields for the wizard
        winrmuser: '',
        winrmpass: '',
        winrmauthtype: '',
    } as AgentlessWindowsWizardPost;

    protected agentlessWindowsAuthTypes: SelectKeyValueString[] = [
        {key: 'basic', value: 'basic'},
        {key: 'credssp', value: 'credssp'}
    ];

    protected override wizardLoad(result: AgentlessWindowsWizardGet): void {
        this.post.winrmuser = result.winrmuser;
        this.post.winrmpass = result.winrmpass;
        this.post.winrmauthtype = result.winrmauthtype;
        super.wizardLoad(result);
    }
}
