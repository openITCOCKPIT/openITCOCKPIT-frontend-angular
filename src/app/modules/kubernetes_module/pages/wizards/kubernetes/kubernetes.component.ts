import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import {
    AccordionButtonDirective,
    AccordionComponent,
    AccordionItemComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormControlDirective,
    FormLabelDirective,
    RowComponent,
    TemplateIdDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { RouterLink } from '@angular/router';
import { GenericValidationError } from '../../../../../generic-responses';
import { KubernetesWizardService } from './kubernetes-wizard.service';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { KubernetesEndpointsWizardPost, KubernetesEndpointWizardGet } from './kubernetes-wizard.interface';
import { Servicetemplate } from '../../../../../pages/wizards/wizards.interface';
import { OitcAlertComponent } from '../../../../../components/alert/alert.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-endpoints',
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
        FormsModule,
        TranslocoDirective,
        TranslocoPipe,
        RouterLink,
        RequiredIconComponent,
        AccordionButtonDirective,
        AccordionComponent,
        AccordionItemComponent,
        TemplateIdDirective,
        RowComponent,
        ColComponent,
        WizardsDynamicfieldsComponent,
        OitcAlertComponent,
        XsButtonDirective
    ],
    templateUrl: './kubernetes.component.html',
    styleUrl: './kubernetes.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KubernetesComponent extends WizardsAbstractComponent {


    @ViewChild(WizardsDynamicfieldsComponent) childComponentLocal!: WizardsDynamicfieldsComponent;
    protected override WizardService: KubernetesWizardService = inject(KubernetesWizardService);
    public checked: boolean = false;

    protected override post: KubernetesEndpointsWizardPost = {
        K8S_PORT: 0,
// Default fields from the base wizard
        host_id: 0,
        services: [],
    };

    protected endpointServicetemplate: Servicetemplate = {} as Servicetemplate;

    protected override wizardLoad(result: KubernetesEndpointWizardGet): void {
        this.cdr.markForCheck();
        this.post.services = [];
        //   this.post.pveUsername = result.pveUsername;
        //   this.post.pveApiTokenName = result.pveApiTokenName;
        //   this.post.pveApiTokenSecret = result.pveApiTokenSecret;
        this.endpointServicetemplate = result.servicetemplates[0];
        super.wizardLoad(result);
    }


    protected runEndpointDiscovery(): void {
        this.post.services = [];
        this.beginDiscovery();
        this.cdr.markForCheck();
        this.WizardService.executeEndpointDiscovery(this.post).subscribe((data: any) => {
            this.post.services = [];
            this.errors = {} as GenericValidationError;
//            this.accordionClosed = true;
            this.cdr.markForCheck();
            // Error
            if (data && data.services && data.services.length && data.services[0].value && data.services[2]) {
                for (let key in data.services[2].value) {
                    let servicetemplatecommandargumentvalues = JSON.parse(JSON.stringify(this.endpointServicetemplate.servicetemplatecommandargumentvalues));
                    servicetemplatecommandargumentvalues[3].value = data.services[2].value[key].name;
                    let name = "PVE Storage Usage " + String(data.services[2].value[key].name);
                    this.post.services.push(
                        {
                            createService: !this.isServiceAlreadyPresent(this.WizardGet.servicesNamesForExistCheck, name),
                            description: '',
                            host_id: this.post.host_id,
                            name: name,
                            servicecommandargumentvalues: servicetemplatecommandargumentvalues,
                            servicetemplate_id: this.endpointServicetemplate.id
                        });
                }
                this.cdr.markForCheck();
                this.endDiscovery();
                return;
            }

            this.notyService.genericError();
            const errorResponse: GenericValidationError = data.data as GenericValidationError;
            if (data.data) {
                this.errors = errorResponse;
                if (this.errors.hasOwnProperty('vcenter') || this.errors.hasOwnProperty('vmwareuser') || this.errors.hasOwnProperty('vmwarepass')) {
                    this.notyService.scrollContentDivToTop();
                }
            }
            this.endDiscovery();
            this.cdr.markForCheck();
        });
    }

}
