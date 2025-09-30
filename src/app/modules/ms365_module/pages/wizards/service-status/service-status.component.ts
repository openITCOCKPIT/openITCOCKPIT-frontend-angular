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
    FormControlDirective,
    FormLabelDirective,
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
import { NgIf } from '@angular/common';
import { OitcAlertComponent } from '../../../../../components/alert/alert.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericValidationError } from '../../../../../generic-responses';
import { M365ServiceStatusService } from './service-status.service';
import { Ms365ServiceStatusWizardGet, Ms365ServiceStatusWizardPost } from './service-status.interface';
import { Servicetemplate } from '../../../../../pages/wizards/wizards.interface';

@Component({
    selector: 'oitc-storage',
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
        WizardsDynamicfieldsComponent,
        RouterLink,
        NgIf,
        OitcAlertComponent,
        XsButtonDirective,
        AccordionButtonDirective,
        AccordionComponent,
        AccordionItemComponent,
        TemplateIdDirective
    ],
    templateUrl: './service-status.component.html',
    styleUrl: './service-status.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceStatusComponent extends WizardsAbstractComponent {
    @ViewChild(WizardsDynamicfieldsComponent) childComponentLocal!: WizardsDynamicfieldsComponent;
    protected override WizardService: M365ServiceStatusService = inject(M365ServiceStatusService);
    public checked: boolean = false;

    protected override post: Ms365ServiceStatusWizardPost = {
        tenantId: '',
        clientId: '',
        clientSecret: '',
// Default fields from the base wizard
        host_id: 0,
        services: [],
    } as Ms365ServiceStatusWizardPost;

    protected storageServicetemplate: Servicetemplate = {} as Servicetemplate;

    protected override wizardLoad(result: Ms365ServiceStatusWizardGet): void {
        this.cdr.markForCheck();
        this.post.services = [];
        this.post.tenantId = result.tenantId;
        this.post.clientId = result.clientId;
        this.post.clientSecret = result.clientSecret;
        this.storageServicetemplate = result.servicetemplates[0];
        super.wizardLoad(result);
    }


    protected runServiceDiscovery(): void {
        this.post.services = [];
        this.cdr.markForCheck();
        this.WizardService.executeServiceDiscovery(this.post).subscribe((data: any) => {
            this.post.services = [];
            this.errors = {} as GenericValidationError;
//            this.accordionClosed = true;
            this.cdr.markForCheck();
            // Error
            if (data && data.services && data.services.length && data.services[0].value && data.services[2]) {
                for (let key in data.services[2].value) {
                    let servicetemplatecommandargumentvalues = JSON.parse(JSON.stringify(this.storageServicetemplate.servicetemplatecommandargumentvalues));
                    servicetemplatecommandargumentvalues[0].value = data.services[2].value[key].serviceOption;
                    let name = "M365 Service Health States " + String(data.services[2].value[key].serviceName);
                    this.post.services.push(
                        {
                            createService: !this.isServiceAlreadyPresent(this.WizardGet.servicesNamesForExistCheck, name),
                            description: '',
                            host_id: this.post.host_id,
                            name: name,
                            servicecommandargumentvalues: servicetemplatecommandargumentvalues,
                            servicetemplate_id: this.storageServicetemplate.id
                        });
                }
                this.cdr.markForCheck();
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
            this.cdr.markForCheck();
        });

    }

}
