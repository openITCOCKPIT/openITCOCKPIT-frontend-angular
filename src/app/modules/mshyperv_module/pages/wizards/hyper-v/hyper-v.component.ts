import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { HyperVWizardService } from './hyper-v-wizard.service';
import { HyperVWizardGet, HyperVWizardPost } from './hyper-v-wizard.interface';
import { RouterLink } from '@angular/router';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';

@Component({
    selector: 'oitc-hyper-v',
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
        SelectComponent
    ],
    templateUrl: './hyper-v.component.html',
    styleUrl: './hyper-v.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HyperVComponent extends WizardsAbstractComponent {

    @ViewChild(WizardsDynamicfieldsComponent) childComponentLocal!: WizardsDynamicfieldsComponent;
    protected override WizardService: HyperVWizardService = inject(HyperVWizardService);
    public checked: boolean = false;

    protected winRmAuthModes: SelectKeyValueString[] = [
        {value: 'basic', key: 'basic'},
        {value: 'credssp', key: 'credssp'},
    ]

    protected override post: HyperVWizardPost = {
        winRmUser: '',
        winRmPw: '',
        winRmAuthMode: '',
// Default fields from the base wizard
        host_id: 0,
        services: [],
    } as HyperVWizardPost;

    protected override wizardLoad(result: HyperVWizardGet): void {
        this.post.winRmUser = result.winRmUser;
        this.post.winRmPw = result.winRmPw;
        this.post.winRmAuthMode = result.winRmAuthMode;
        super.wizardLoad(result);
    }

}
