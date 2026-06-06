import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
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
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { RouterLink } from '@angular/router';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { Ms365ServiceStatusWizardGet, Ms365ServiceStatusWizardPost } from '../service-status/service-status.interface';
import { OneDriveService } from './one-drive.service';

@Component({
    selector: 'oitc-one-drive',
    imports: [
        AccordionButtonDirective,
        AccordionComponent,
        AccordionItemComponent,
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        ReactiveFormsModule,
        TemplateIdDirective,
        TranslocoDirective,
        TranslocoPipe,
        WizardsDynamicfieldsComponent,
        RouterLink,
        FormsModule
    ],
    templateUrl: './one-drive.component.html',
    styleUrl: './one-drive.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OneDriveComponent extends WizardsAbstractComponent {

    @ViewChild(WizardsDynamicfieldsComponent) childComponentLocal!: WizardsDynamicfieldsComponent;
    protected override WizardService: OneDriveService = inject(OneDriveService);
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

