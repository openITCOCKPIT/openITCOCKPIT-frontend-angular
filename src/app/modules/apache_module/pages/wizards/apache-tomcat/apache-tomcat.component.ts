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
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { ApacheTomcatWizardGet, ApacheTomcatWizardPost } from './apache-tomcat-wizard.interface';
import { ApacheTomcatWizardService } from './apache-tomcat-wizard.service';
import { RouterLink } from '@angular/router';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';

@Component({
    selector: 'oitc-apache-tomcat',
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
        TemplateIdDirective,
        RequiredIconComponent,
        SelectComponent
    ],
    templateUrl: './apache-tomcat.component.html',
    styleUrl: './apache-tomcat.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApacheTomcatComponent extends WizardsAbstractComponent {

    @ViewChild(WizardsDynamicfieldsComponent) childComponentLocal!: WizardsDynamicfieldsComponent;
    protected override WizardService: ApacheTomcatWizardService = inject(ApacheTomcatWizardService);
    public checked: boolean = false;

    protected override post: ApacheTomcatWizardPost = {
        host_id: 0,
        services: [],
        TOMCAT_USER: '',
        TOMCAT_PW: '',
        TOMCAT_PORT: 8080,
        TOMCAT_AUTH_MODE: '',
    } as ApacheTomcatWizardPost;

    protected override wizardLoad(result: ApacheTomcatWizardGet): void {
        console.warn(result);
        this.post.TOMCAT_USER = result.TOMCAT_USER;
        this.post.TOMCAT_PW = result.TOMCAT_PW;
        this.post.TOMCAT_PORT = result.TOMCAT_PORT;
        this.post.TOMCAT_AUTH_MODE = result.TOMCAT_AUTH_MODE;
        super.wizardLoad(result);
    }

    protected tomcatAuthModes: SelectKeyValueString[] = [
        {key: 'basic', value: 'basic'}
    ];

}
