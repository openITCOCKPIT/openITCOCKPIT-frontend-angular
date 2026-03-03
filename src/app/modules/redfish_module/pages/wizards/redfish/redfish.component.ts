import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
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
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { RouterLink } from '@angular/router';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { RedfishWizardService } from './redfish-wizard.service';
import { RedfishWizardGet, RedfishWizardPost } from './redfish-wizard.interface';

@Component({
    selector: 'oitc-redfish',
    imports: [
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
        TranslocoDirective,
        TranslocoPipe,
        WizardsDynamicfieldsComponent,
        FormsModule,
        RouterLink,
        RequiredIconComponent,
        AccordionComponent,
        AccordionItemComponent,
        TemplateIdDirective,
        AccordionButtonDirective
    ],
    templateUrl: './redfish.component.html',
    styleUrl: './redfish.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RedfishComponent extends WizardsAbstractComponent {

    @ViewChild(WizardsDynamicfieldsComponent) childComponentLocal!: WizardsDynamicfieldsComponent;
    protected override WizardService: RedfishWizardService = inject(RedfishWizardService);

    protected override post: RedfishWizardPost = {
        REDFISH_USER: '',
        REDFISH_PASS: '',
// Default fields from the base wizard
        host_id: 0,
        services: [],
    } as RedfishWizardPost;

    protected override wizardLoad(result: RedfishWizardGet): void {
        this.post.REDFISH_USER = result.REDFISH_USER;
        this.post.REDFISH_PASS = result.REDFISH_PASS;
        super.wizardLoad(result);
    }
}
