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
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
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
import { NextcloudWizardGet, NextcloudWizardPost } from './nextcloud-wizard.interface';
import { NextcloudWizardService } from './nextcloud-wizard.service';
import { RouterLink } from '@angular/router';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';

@Component({
    selector: 'oitc-nextcloud',
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
        AccordionButtonDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective
    ],
    templateUrl: './nextcloud.component.html',
    styleUrl: './nextcloud.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NextcloudComponent extends WizardsAbstractComponent {

    @ViewChild(WizardsDynamicfieldsComponent) childComponentLocal!: WizardsDynamicfieldsComponent;
    protected override WizardService: NextcloudWizardService = inject(NextcloudWizardService);
    protected useSsl: boolean = false;


    protected override post: NextcloudWizardPost = {
        NEXTCLOUD_TOKEN: '',
// Default fields from the base wizard
        host_id: 0,
        services: [],
    } as NextcloudWizardPost;

    protected override wizardLoad(result: NextcloudWizardGet): void {
        console.warn(result);
        this.post.NEXTCLOUD_TOKEN = result.NEXTCLOUD_TOKEN;
        super.wizardLoad(result);
    }

    protected useSslChanged(): void {
        if (this.useSsl) {
            this.post.services[0].servicecommandargumentvalues[2].value = this.post.services[0].servicecommandargumentvalues[2].value + ' --ssl';
        } else {
            this.post.services[0].servicecommandargumentvalues[2].value = this.post.services[0].servicecommandargumentvalues[2].value.replace('--ssl', '');
        }

        this.cdr.markForCheck();
        this.childComponent.cdr.markForCheck();
    }

}
