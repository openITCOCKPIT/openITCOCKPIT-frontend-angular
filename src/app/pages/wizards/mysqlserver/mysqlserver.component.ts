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
    FormControlDirective,
    FormLabelDirective,
    TemplateIdDirective
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';


import {
    WizardsDynamicfieldsComponent
} from '../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { MysqlWizardGet, MysqlWizardPost } from './mysqlserver-wizard.interface';
import { MysqlserverWizardService } from './mysqlserver-wizard.service';
import { WizardsAbstractComponent } from '../wizards-abstract/wizards-abstract.component';
import { SystemnameService } from '../../../services/systemname.service';
import { BackButtonDirective } from '../../../directives/back-button.directive';

@Component({
    selector: 'oitc-mysqlserver',
    imports: [
        FaIconComponent,
        TranslocoDirective,
        RouterLink,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        FormControlDirective,
        RequiredIconComponent,
        AccordionComponent,
        AccordionItemComponent,
        AccordionButtonDirective,
        TemplateIdDirective,
        TranslocoPipe,
        FormLabelDirective,
        WizardsDynamicfieldsComponent,
        BackButtonDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormsModule
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
        database: 'information_schema',
        password: '',
        username: ''
    } as MysqlWizardPost;

    private readonly SystemnameService = inject(SystemnameService);
    protected serverAddr: string = '1.2.3.4';
    protected systemName: string = 'openITCOCKPIT';

    public override ngOnInit() {
        this.SystemnameService.systemName$.forEach((a: string) => {
            this.systemName = a;
        })
        super.ngOnInit();

    }

    protected override wizardLoad(result: MysqlWizardGet): void {
        this.post.username = result.username;
        this.post.password = result.password;
        this.post.database = result.database || this.post.database;
        this.serverAddr = result.serverAddr;
        super.wizardLoad(result);
    }
}
