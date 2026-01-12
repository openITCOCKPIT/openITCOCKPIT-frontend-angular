import { ChangeDetectionStrategy, Component, inject, ViewChildren } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import {
    DatastoreService,
    DatastoreServicetemplate,
    VmwareDatastoresWizardGet,
    VmwareDatastoresWizardPost
} from './vmware-datastores-wizard.interface';
import { VmwareDatastoresWizardService } from './vmware-datastores-wizard.service';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import {
    AccordionButtonDirective,
    AccordionComponent,
    AccordionItemComponent,
    AlertComponent,
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
    TemplateIdDirective
} from '@coreui/angular';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { NgClass } from '@angular/common';
import { NgSelectComponent } from '@ng-select/ng-select';
import { OitcAlertComponent } from '../../../../../components/alert/alert.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-vmware-esx',
    imports: [
    PaginatorModule,
    FormsModule,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    CardBodyComponent,
    RouterLink,
    FaIconComponent,
    TranslocoPipe,
    BackButtonDirective,
    RequiredIconComponent,
    FormControlDirective,
    FormErrorDirective,
    FormFeedbackComponent,
    TranslocoDirective,
    FormLabelDirective,
    AlertComponent,
    AccordionButtonDirective,
    AccordionComponent,
    AccordionItemComponent,
    TemplateIdDirective,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NgSelectComponent,
    OitcAlertComponent,
    RowComponent,
    XsButtonDirective,
    NgClass
],
    templateUrl: './vmware-datastores.component.html',
    styleUrl: './vmware-datastores.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VmwareDatastoresComponent extends WizardsAbstractComponent {
    @ViewChildren('accordionItem') accordionItems: AccordionItemComponent[] = [];
    protected override WizardService: VmwareDatastoresWizardService = inject(VmwareDatastoresWizardService);
    public checked: boolean = false;
    public accordionClosed: boolean = true;

    protected override post: VmwareDatastoresWizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
        dataStoreServices: [],
// Fields for the wizard
        vmwareuser: '',
        vmwarepass: '',
        vcenter: '',
        typeId: 'vmware-datastores'
    } as VmwareDatastoresWizardPost;

    protected searchedTags: string[] = [];
    protected datastoreServicetemplate: DatastoreServicetemplate = {} as DatastoreServicetemplate;

    protected override wizardLoad(result: VmwareDatastoresWizardGet): void {
        this.post.vmwareuser = result.vmwareuser;
        this.post.vmwarepass = result.vmwarepass;
        this.post.vcenter = result.vcenter;
        this.datastoreServicetemplate = result.datastoreServicetemplate;
        this.cdr.markForCheck();
    }

    public override submit(): void {
        // let request = this.post; // Clone the original post object here!
        let request: VmwareDatastoresWizardPost = JSON.parse(JSON.stringify(this.post));

        // Remove all datastore services from request where createService is false.
        request.dataStoreServices = request.dataStoreServices.filter(
            (dataStoreService: DatastoreService) => dataStoreService.createService && this.hasName(dataStoreService.name)
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

    protected toggleCheck(checked: boolean): void {
        this.checked = checked;
        this.post.dataStoreServices.forEach((service: DatastoreService) => {
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

    protected runDatastoreDiscovery(): void {
        this.post.dataStoreServices = [];
        this.beginDiscovery();
        this.cdr.markForCheck();
        this.WizardService.executeDatastoreDiscovery(this.post).subscribe((data: any) => {
            this.errors = {} as GenericValidationError;
            this.accordionClosed = true;
            this.cdr.markForCheck();
            // Error
            if (data && data.services && data.services.length && data.services[0].value && data.services[2]) {
                for (let key in data.services[2].value) {
                    let servicetemplatecommandargumentvalues = JSON.parse(JSON.stringify(this.datastoreServicetemplate.servicetemplatecommandargumentvalues));
                    servicetemplatecommandargumentvalues[3].value = data.services[2].value[key].name;
                    let name = "Datastore " + String(data.services[2].value[key].name);
                    this.post.dataStoreServices.push(
                        {
                            createService: !this.isServiceAlreadyPresent(this.WizardGet.servicesNamesForExistCheck, name),
                            description: '',
                            host_id: this.post.host_id,
                            name: name,
                            servicecommandargumentvalues: servicetemplatecommandargumentvalues,
                            servicetemplate_id: this.datastoreServicetemplate.id
                        });
                }
                this.endDiscovery();
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
            this.endDiscovery();
            this.cdr.markForCheck();
        });
    }

}
