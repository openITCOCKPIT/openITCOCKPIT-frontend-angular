import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { NetAppWizardService } from './net-app-wizard.service';
import { NetAppWizardGet, NetAppWizardPost } from './net-app-wizard.interface';
import { FormsModule } from '@angular/forms';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { ProgressBarModule } from 'primeng/progressbar';
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
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';

@Component({
    selector: 'oitc-net-app',
    imports: [
        RouterLink,
        FaIconComponent,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        TranslocoPipe,
        RequiredIconComponent,
        FormLabelDirective,
        FormControlDirective,
        WizardsDynamicfieldsComponent,
        TranslocoDirective,
        ProgressBarModule,
        CardTitleDirective,
        BackButtonDirective,
        FormFeedbackComponent,
        FormErrorDirective,
        FormsModule,
        AccordionButtonDirective,
        AccordionComponent,
        AccordionItemComponent,
        TemplateIdDirective
    ],
    templateUrl: './net-app.component.html',
    styleUrl: './net-app.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetAppComponent extends WizardsAbstractComponent {
    @ViewChild(WizardsDynamicfieldsComponent) childComponentLocal!: WizardsDynamicfieldsComponent;
    protected override WizardService: NetAppWizardService = inject(NetAppWizardService);
    public checked: boolean = false;

    protected override post: NetAppWizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
// Fields for the wizard
        netappuser: '',
        netapppass: '',
    } as NetAppWizardPost;


    protected override wizardLoad(result: NetAppWizardGet): void {
        this.post.netappuser = result.netappuser;
        this.post.netapppass = result.netapppass;
        super.wizardLoad(result);
    }
}
