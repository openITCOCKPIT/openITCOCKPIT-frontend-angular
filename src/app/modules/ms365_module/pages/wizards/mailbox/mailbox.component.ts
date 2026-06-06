import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
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
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { RouterLink } from '@angular/router';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { Ms365ServiceStatusWizardGet, Ms365ServiceStatusWizardPost } from '../service-status/service-status.interface';
import { M365MailboxService } from './mailbox.service';

@Component({
    selector: 'oitc-mailbox',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormsModule,
        TranslocoDirective,
        TranslocoPipe,
        WizardsDynamicfieldsComponent,
        RouterLink,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        AccordionButtonDirective,
        AccordionComponent,
        AccordionItemComponent,
        TemplateIdDirective
    ],
    templateUrl: './mailbox.component.html',
    styleUrl: './mailbox.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailboxComponent extends WizardsAbstractComponent {

    @ViewChild(WizardsDynamicfieldsComponent) childComponentLocal!: WizardsDynamicfieldsComponent;
    protected override WizardService: M365MailboxService = inject(M365MailboxService);
    public checked: boolean = false;
    protected override post: Ms365ServiceStatusWizardPost = {
        tenantId: '',
        clientId: '',
        clientSecret: '',
// Default fields from the base wizard
        host_id: 0,
        services: [],
    } as Ms365ServiceStatusWizardPost;

    protected override wizardLoad(result: Ms365ServiceStatusWizardGet): void {
        this.post.tenantId = result.tenantId;
        this.post.clientId = result.clientId;
        this.post.clientSecret = result.clientSecret;
        super.wizardLoad(result);
        this.cdr.markForCheck();
    }
}
