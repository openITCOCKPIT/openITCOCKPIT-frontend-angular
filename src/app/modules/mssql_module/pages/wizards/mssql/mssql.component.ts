import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { MssqlWizardService } from './mssql-wizard.service';
import { MssqlWizardGet, MssqlWizardPost } from './mssql-wizard.interface';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormLabelDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'oitc-mssql',
    standalone: true,
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        RequiredIconComponent,
        TranslocoDirective,
        TranslocoPipe,
        WizardsDynamicfieldsComponent,
        RouterLink
    ],
    templateUrl: './mssql.component.html',
    styleUrl: './mssql.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MssqlComponent extends WizardsAbstractComponent {
    protected override WizardService: MssqlWizardService = inject(MssqlWizardService);

    protected override post: MssqlWizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
// Fields for the wizard
        dbuser: '',
        dbpass: '',
    } as MssqlWizardPost;

    protected override wizardLoad(result: MssqlWizardGet): void {
        this.post.dbpass = result.dbpass;
        this.post.dbuser = result.dbuser;
    }

}
