import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective, FormLabelDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { ProxmoxWizardGet, ProxmoxWizardPost } from './proxmox-wizard.interface';
import { ProxmoxWizardService } from './proxmox-wizard.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'oitc-proxmox',
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
        NgIf,
        ReactiveFormsModule,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        TranslocoPipe,
        WizardsDynamicfieldsComponent,
        FormsModule,
        RouterLink
    ],
    templateUrl: './proxmox.component.html',
    styleUrl: './proxmox.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProxmoxComponent extends WizardsAbstractComponent {

    @ViewChild(WizardsDynamicfieldsComponent) childComponentLocal!: WizardsDynamicfieldsComponent;
    protected override WizardService: ProxmoxWizardService = inject(ProxmoxWizardService);
    public checked: boolean = false;

    protected override post: ProxmoxWizardPost = {
        pveUsername: '',
        pveApiTokenName: '',
        pveApiTokenSecret: '',
// Default fields from the base wizard
        host_id: 0,
        services: [],
    } as ProxmoxWizardPost;

    protected override wizardLoad(result: ProxmoxWizardGet): void {
        console.warn(result);
        this.post.pveUsername = result.pveUsername;
        this.post.pveApiTokenName = result.pveApiTokenName;
        this.post.pveApiTokenSecret = result.pveApiTokenSecret;
        super.wizardLoad(result);
    }

}
