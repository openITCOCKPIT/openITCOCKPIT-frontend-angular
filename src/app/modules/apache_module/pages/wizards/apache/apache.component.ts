import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { CardBodyComponent, CardComponent, CardHeaderComponent, CardTitleDirective } from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { ApacheWizardGet, ApacheWizardPost } from './apache-wizard.interface';
import { ApacheWizardService } from './apache-wizard.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'oitc-apache',
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
    ],
    templateUrl: './apache.component.html',
    styleUrl: './apache.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApacheComponent extends WizardsAbstractComponent {

    @ViewChild(WizardsDynamicfieldsComponent) childComponentLocal!: WizardsDynamicfieldsComponent;
    protected override WizardService: ApacheWizardService = inject(ApacheWizardService);
    public checked: boolean = false;

    protected override post: ApacheWizardPost = {
        pveUsername: '',
        pveApiTokenName: '',
        pveApiTokenSecret: '',
        storageServices: [],
// Default fields from the base wizard
        host_id: 0,
        services: [],
    } as ApacheWizardPost;

    protected override wizardLoad(result: ApacheWizardGet): void {
        console.warn(result);
        this.post.pveUsername = result.pveUsername;
        this.post.pveApiTokenName = result.pveApiTokenName;
        this.post.pveApiTokenSecret = result.pveApiTokenSecret;
        super.wizardLoad(result);
    }

}
