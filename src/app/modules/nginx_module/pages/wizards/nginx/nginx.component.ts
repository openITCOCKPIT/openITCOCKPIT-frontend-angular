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
import { NginxWizardGet, NginxWizardPost } from './nginx-wizard.interface';
import { NginxWizardService } from './nginx-wizard.service';
import { RouterLink } from '@angular/router';

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
    ],
    templateUrl: './nginx.component.html',
    styleUrl: './nginx.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NginxComponent extends WizardsAbstractComponent {

    @ViewChild(WizardsDynamicfieldsComponent) childComponentLocal!: WizardsDynamicfieldsComponent;
    protected override WizardService: NginxWizardService = inject(NginxWizardService);
    public checked: boolean = false;

    protected override post: NginxWizardPost = {
        pveUsername: '',
        pveApiTokenName: '',
        pveApiTokenSecret: '',
        storageServices: [],
// Default fields from the base wizard
        host_id: 0,
        services: [],
    } as NginxWizardPost;

    protected override wizardLoad(result: NginxWizardGet): void {
        console.warn(result);
        this.post.pveUsername = result.pveUsername;
        this.post.pveApiTokenName = result.pveApiTokenName;
        this.post.pveApiTokenSecret = result.pveApiTokenSecret;
        super.wizardLoad(result);
    }

}
