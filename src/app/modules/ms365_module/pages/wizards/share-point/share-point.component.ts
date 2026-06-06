import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { Ms365ServiceStatusWizardGet, Ms365ServiceStatusWizardPost } from '../service-status/service-status.interface';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import {
    AccordionButtonDirective,
    AccordionComponent,
    AccordionItemComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    FormControlDirective,
    FormLabelDirective,
    TemplateIdDirective
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { M365SharePointService } from './share-point.service';

@Component({
    selector: 'oitc-share-point',
    imports: [
        WizardsDynamicfieldsComponent,
        FormFeedbackComponent,
        FormErrorDirective,
        FormControlDirective,
        FormLabelDirective,
        FormsModule,
        AccordionItemComponent,
        AccordionComponent,
        TemplateIdDirective,
        FaIconComponent,
        CardBodyComponent,
        CardHeaderComponent,
        CardComponent,
        RouterLink,
        AccordionButtonDirective,
        BackButtonDirective,
        TranslocoDirective,
        TranslocoPipe
    ],
    templateUrl: './share-point.component.html',
    styleUrl: './share-point.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharePointComponent extends WizardsAbstractComponent {

    @ViewChild(WizardsDynamicfieldsComponent) childComponentLocal!: WizardsDynamicfieldsComponent;
    protected override WizardService: M365SharePointService = inject(M365SharePointService);
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
