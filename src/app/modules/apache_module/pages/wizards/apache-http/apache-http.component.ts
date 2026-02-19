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
import { ApacheHttpWizardPost } from './apache-http-wizard.interface';
import { ApacheHttpWizardService } from './apache-http-wizard.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'oitc-apache-http',
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
    templateUrl: './apache-http.component.html',
    styleUrl: './apache-http.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApacheHttpComponent extends WizardsAbstractComponent {

    @ViewChild(WizardsDynamicfieldsComponent) childComponentLocal!: WizardsDynamicfieldsComponent;
    protected override WizardService: ApacheHttpWizardService = inject(ApacheHttpWizardService);
    public checked: boolean = false;

    protected override post: ApacheHttpWizardPost = {
        host_id: 0,
        services: [],
    } as ApacheHttpWizardPost;

}
