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
    TemplateIdDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { NginxWizardPost } from './nginx-wizard.interface';
import { NginxWizardService } from './nginx-wizard.service';
import { RouterLink } from '@angular/router';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';

@Component({
    selector: 'oitc-nginx',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        ReactiveFormsModule,
        TranslocoDirective,
        TranslocoPipe,
        WizardsDynamicfieldsComponent,
        FormsModule,
        RouterLink,
        AccordionButtonDirective,
        AccordionComponent,
        AccordionItemComponent,
        TemplateIdDirective,
        FormErrorDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
    ],
    templateUrl: './nginx.component.html',
    styleUrl: './nginx.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NginxComponent extends WizardsAbstractComponent {

    @ViewChild(WizardsDynamicfieldsComponent) childComponentLocal!: WizardsDynamicfieldsComponent;
    protected override WizardService: NginxWizardService = inject(NginxWizardService);
    protected useSsl: boolean = false;

    protected override post: NginxWizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
// Nginx specific fields
        hostNginxOptions: ''
    } as NginxWizardPost;


    protected useSslChanged(): void {
        if (this.useSsl) {
            this.post.services[0].servicecommandargumentvalues[4].value = this.post.services[0].servicecommandargumentvalues[4].value + ' --ssl';
        } else {
            this.post.services[0].servicecommandargumentvalues[4].value = this.post.services[0].servicecommandargumentvalues[4].value.replace('--ssl', '');
        }

        this.cdr.markForCheck();
        this.childComponent.cdr.markForCheck();
    }

}
