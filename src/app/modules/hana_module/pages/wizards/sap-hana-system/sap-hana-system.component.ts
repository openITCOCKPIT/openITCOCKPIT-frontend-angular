import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormLabelDirective
} from '@coreui/angular';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormsModule } from '@angular/forms';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { SapHanaSystemWizardService } from './sap-hana-system-wizard.service';
import { SapHanaSystemWizardGet, SapHanaSystemWizardPost } from './sap-hana-system-wizard.interface';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';

@Component({
    selector: 'oitc-sap-hana-system',
    imports: [
        TranslocoDirective,
        RouterLink,
        FaIconComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        FormErrorDirective,
        FormsModule,
        FormControlDirective,
        FormFeedbackComponent,
        WizardsDynamicfieldsComponent,
        RequiredIconComponent,
        FormLabelDirective,
        TranslocoPipe,
        BackButtonDirective
    ],
    templateUrl: './sap-hana-system.component.html',
    styleUrl: './sap-hana-system.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SapHanaSystemComponent extends WizardsAbstractComponent {
    protected override WizardService: SapHanaSystemWizardService = inject(SapHanaSystemWizardService);

    protected override post: SapHanaSystemWizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
// Fields for the wizard
        dbuser: '',
        dbpassword: '',
        dbtenantport: '',
        dbsystemport: '',
        typeId: 'sap-hana-system'
    } as SapHanaSystemWizardPost;

    protected override wizardLoad(result: SapHanaSystemWizardGet): void {
        this.post.dbuser = result.dbuser;
        this.post.dbpassword = result.dbpassword;
        this.post.dbtenantport = result.dbtenantport;
        this.post.dbsystemport = result.dbsystemport;
        super.wizardLoad(result);
    }

}
