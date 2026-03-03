import { ChangeDetectionStrategy, Component, inject, ViewChild, ViewChildren } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
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
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent,
    TemplateIdDirective,
    TooltipDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { KubernetesWizardService } from './kubernetes-wizard.service';
import { RouterLink } from '@angular/router';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { NgClass } from '@angular/common';
import { OitcAlertComponent } from '../../../../../components/alert/alert.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ServiceForWizard, ServicetemplateForWizard } from '../../../../../pages/wizards/wizards.interface';
import { KubernetesEndpointsWizardPost, KubernetesEndpointWizardGet } from './kubernetes-wizard.interface';

@Component({
    selector: 'oitc-kubernetes-endpoints',
    imports: [

        ColComponent,
        FaIconComponent,
        FormCheckInputDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        NgSelectComponent,
        RowComponent,
        TranslocoPipe,
        TranslocoDirective,
        FormFeedbackComponent,
        NgClass,
        FormCheckLabelDirective,
        FormCheckComponent,
        AccordionComponent,
        AccordionItemComponent,
        TemplateIdDirective,
        AccordionButtonDirective,
        XsButtonDirective,
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormsModule,
        TranslocoDirective,
        TranslocoPipe,
        WizardsDynamicfieldsComponent,
        RouterLink,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        AccordionButtonDirective,
        AccordionComponent,
        AccordionItemComponent,
        TemplateIdDirective,
        RequiredIconComponent,
        OitcAlertComponent,
        XsButtonDirective,
        RowComponent,
        ColComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        NgSelectComponent,
        NgClass,
        TooltipDirective
    ],
    templateUrl: './kubernetes.component.html',
    styleUrl: './kubernetes.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KubernetesComponent extends WizardsAbstractComponent {

    @ViewChildren('accordionItem') accordionItems: AccordionItemComponent[] = [];
    @ViewChild(WizardsDynamicfieldsComponent) childComponentLocal!: WizardsDynamicfieldsComponent;
    protected override WizardService: KubernetesWizardService = inject(KubernetesWizardService);
    public checked: boolean = false;
    protected searchedTags: string[] = [];
    public accordionClosed: boolean = true;

    protected override post: KubernetesEndpointsWizardPost = {
        K8S_PORT: 6443,
        TOKEN_FILE_PATH: '',
        TOKEN_FILE_EXISTS: false,
        endpointservices: [],
// Default fields from the base wizard
        host_id: 0,
        services: [],
    };

    protected endpointServicetemplate: ServicetemplateForWizard = {} as ServicetemplateForWizard;
    protected TOKEN_FILE_EXISTS: boolean = false;
    protected TOKEN_FILE_PATH: string = '';

    protected override wizardLoad(result: KubernetesEndpointWizardGet): void {

        this.cdr.markForCheck();
        this.post.K8S_PORT = result.K8S_PORT;
        this.TOKEN_FILE_PATH = result.TOKEN_FILE_PATH;
        this.TOKEN_FILE_EXISTS = result.TOKEN_FILE_EXISTS;
        this.endpointServicetemplate = result.endpointServicetemplate;
        super.wizardLoad(result);
    }

    public override submit(): void {
        // let request = this.post; // Clone the original post object here!
        let request: KubernetesEndpointsWizardPost = JSON.parse(JSON.stringify(this.post));

        // Remove all services from request where createService is false.
        request.services = request.services.filter((service: ServiceForWizard) => {
            return service.createService && this.childComponent.hasName(service.name);
        });

        // Remove all Apache Tomcat memory pool services from request where createService is false.
        request.endpointservices = request.endpointservices.filter(
            (memoryPoolServices: ServiceForWizard) => memoryPoolServices.createService && this.hasName(memoryPoolServices.name)
        );

        this.subscriptions.add(this.WizardService.submit(request)
            .subscribe((result: GenericResponseWrapper) => {
                this.errors = {} as GenericValidationError;
                if (result.success) {
                    const title: string = this.TranslocoService.translate('Success');
                    const msg: string = this.TranslocoService.translate('Data saved successfully');

                    this.notyService.genericSuccess(msg, title);
                    this.router.navigate(['/services/notMonitored']);
                    this.cdr.markForCheck();
                    return;
                }
                // Error
                this.notyService.genericError();
                this.notyService.scrollContentDivToTop();
                const errorResponse: GenericValidationError = result.data as GenericValidationError;
                if (result) {
                    this.errors = errorResponse;

                }
                this.cdr.markForCheck();
            })
        );
    }


    protected runEndpointDiscovery(): void {
        this.beginDiscovery();
        this.cdr.markForCheck();
        this.WizardService.executeEndpointDiscovery(this.post).subscribe((data: any) => {
            this.post.endpointservices = [];
            this.errors = {} as GenericValidationError;
            this.cdr.markForCheck();
            this.post.TOKEN_FILE_EXISTS = data.TOKEN_FILE_EXISTS;
            // Error
            if (data && data.services && data.services.length && data.services[0].value && data.services[2]) {

                for (let key in data.services[2].value) {

                    // Traverse the groups
                    Object.entries(data.services[2].value[key].name).forEach(([groupName, value]) => {

                        // Traverse the endpoints
                        for (let endpointKey in data.services[2].value[key].name[groupName]) {
                            let endpointName = data.services[2].value[key].name[groupName][endpointKey];
                            let name = "k8s endpoint " + groupName + "/" + endpointName;

                            // Set the argument values
                            let servicetemplatecommandargumentvalues = structuredClone(this.endpointServicetemplate.servicetemplatecommandargumentvalues);
                            servicetemplatecommandargumentvalues[1].value = groupName;
                            servicetemplatecommandargumentvalues[2].value = endpointName;

                            // Add service
                            this.post.endpointservices.push(
                                {
                                    createService: !this.isServiceAlreadyPresent(this.WizardGet.servicesNamesForExistCheck, name),
                                    description: '',
                                    host_id: this.post.host_id,
                                    name: name,
                                    servicecommandargumentvalues: servicetemplatecommandargumentvalues,
                                    servicetemplate_id: this.endpointServicetemplate.id
                                });
                        }
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
                if (this.errors.hasOwnProperty('K8S_PORT')) {
                    this.notyService.scrollContentDivToTop();
                }
            }
            this.endDiscovery();
            this.cdr.markForCheck();
        });

    }


    protected toggleCheck(checked: boolean): void {
        this.checked = checked;
        this.post.endpointservices.forEach((service: ServiceForWizard) => {
            if (!this.hasName(service.name)) {
                return;
            }
            service.createService = this.checked;
        });
        this.cdr.markForCheck();
    }

    protected toggleAccordionClose(checked: boolean): void {
        this.accordionClosed = checked;
        this.accordionItems.forEach((accordionItem: AccordionItemComponent) => {
            if ((accordionItem.visible && this.accordionClosed) || (!accordionItem.visible && !this.accordionClosed)) {
                accordionItem.toggleItem();
            }
        });
        this.cdr.markForCheck();
    }

    protected detectColor = function (label: string): string {
        if (label.match(/warning/gi)) {
            return 'warning';
        }

        if (label.match(/critical/gi)) {
            return 'critical';
        }

        return '';
    };

    protected hasName = (name: string): boolean => {
        if (this.searchedTags.length === 0) {
            return true;
        }
        return this.searchedTags.some((tag) => {
            return name.toLowerCase().includes(tag.toLowerCase());
        });
    }

}
