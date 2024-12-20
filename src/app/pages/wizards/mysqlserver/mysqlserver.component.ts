import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
    AccordionButtonDirective,
    AccordionComponent,
    AccordionItemComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormControlDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent,
    TemplateIdDirective
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { NgForOf, NgIf } from '@angular/common';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { NgSelectComponent } from '@ng-select/ng-select';
import {
    WizardsDynamicfieldsComponent
} from '../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { MysqlWizardGet, MysqlWizardPost } from './mysqlserver-wizard.interface';
import { MysqlserverWizardService } from './mysqlserver-wizard.service';
import { WizardsAbstractComponent } from '../wizards-abstract/wizards-abstract.component';

@Component({
    selector: 'oitc-mysqlserver',
    standalone: true,
    imports: [
        FaIconComponent,
        TranslocoDirective,
        RouterLink,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        FormsModule,
        FormErrorDirective,
        FormFeedbackComponent,
        FormControlDirective,
        RequiredIconComponent,
        NgForOf,
        AccordionComponent,
        AccordionItemComponent,
        AccordionButtonDirective,
        TemplateIdDirective,
        RowComponent,
        ColComponent,
        DebounceDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        TranslocoPipe,
        NgSelectComponent,
        FormCheckInputDirective,
        FormCheckComponent,
        NgIf,
        FormLabelDirective,
        WizardsDynamicfieldsComponent
    ],
    templateUrl: './mysqlserver.component.html',
    styleUrl: './mysqlserver.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MysqlserverComponent extends WizardsAbstractComponent {
    // Inherited fields
    protected override WizardService: MysqlserverWizardService = inject(MysqlserverWizardService);
    protected override post: MysqlWizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
// Fields for the wizard
        database: '',
        password: '',
        username: ''
    } as MysqlWizardPost;

    protected serverAddr: string = 'localhost';
    protected systemName: string = 'mysqlserver';

    protected override wizardLoad(result: MysqlWizardGet): void {
        this.post.username = result.username;
        this.post.password = result.password;
        this.post.database = result.database;
        super.wizardLoad(result);
    }
}
