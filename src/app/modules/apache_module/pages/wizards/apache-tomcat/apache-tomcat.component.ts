import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
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
    FormControlDirective,
    FormLabelDirective,
    RowComponent,
    TemplateIdDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { ApacheTomcatWizardGet, ApacheTomcatWizardPost } from './apache-tomcat-wizard.interface';
import { ApacheTomcatWizardService } from './apache-tomcat-wizard.service';
import { RouterLink } from '@angular/router';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { GenericValidationError } from '../../../../../generic-responses';
import {
    StorageServiceTemplate
} from '../../../../proxmox_module/pages/wizards/storage/proxmox-storage-wizard.interface';
import { NgIf } from '@angular/common';
import { OitcAlertComponent } from '../../../../../components/alert/alert.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-apache-tomcat',
    imports: [
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
        SelectComponent,
        NgIf,
        OitcAlertComponent,
        XsButtonDirective,
        RowComponent,
        ColComponent
    ],
    templateUrl: './apache-tomcat.component.html',
    styleUrl: './apache-tomcat.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApacheTomcatComponent extends WizardsAbstractComponent {

    @ViewChild(WizardsDynamicfieldsComponent) childComponentLocal!: WizardsDynamicfieldsComponent;
    protected override WizardService: ApacheTomcatWizardService = inject(ApacheTomcatWizardService);
    public checked: boolean = false;

    protected override post: ApacheTomcatWizardPost = {
        host_id: 0,
        services: [],
        TOMCAT_USER: '',
        TOMCAT_PW: '',
        TOMCAT_PORT: 8080,
        TOMCAT_AUTH_MODE: '',
        memoryPoolServices: []
    } as ApacheTomcatWizardPost;

    protected memoryPoolServiceTemplate: StorageServiceTemplate = {} as StorageServiceTemplate;

    protected override wizardLoad(result: ApacheTomcatWizardGet): void {
        this.cdr.markForCheck();
        this.post.TOMCAT_USER = result.TOMCAT_USER;
        this.post.TOMCAT_PW = result.TOMCAT_PW;
        this.post.TOMCAT_PORT = result.TOMCAT_PORT;
        this.post.TOMCAT_AUTH_MODE = result.TOMCAT_AUTH_MODE;
        this.memoryPoolServiceTemplate = result.servicetemplates[0];
        super.wizardLoad(result);
    }

    protected tomcatAuthModes: SelectKeyValueString[] = [
        {key: 'basic', value: 'basic'}
    ];

    protected executeMemoryPoolDiscovery(): void {
        this.post.memoryPoolServices = [];
        this.cdr.markForCheck();
        this.WizardService.executeMemoryPoolDiscovery(this.post).subscribe((data: any) => {
            this.post.memoryPoolServices = [];
            this.errors = {} as GenericValidationError;
//            this.accordionClosed = true;
            this.cdr.markForCheck();
            // Error
            if (data && data.memorypools && data.memorypools.length && data.memorypools[0].value && data.memorypools[2]) {
                for (let key in data.memorypools[2].value) {
                    let myStoragePool: string = String(data.memorypools[2].value[key]);
                    console.warn(myStoragePool);
                    let servicetemplatecommandargumentvalues = JSON.parse(JSON.stringify(this.memoryPoolServiceTemplate.servicetemplatecommandargumentvalues));
                    servicetemplatecommandargumentvalues[0].value = myStoragePool;
                    let name = "Tomcat Memory-Pool " + myStoragePool;
                    this.post.memoryPoolServices.push(
                        {
                            createService: !this.isServiceAlreadyPresent(this.WizardGet.servicesNamesForExistCheck, name),
                            description: '',
                            host_id: this.post.host_id,
                            name: name,
                            servicecommandargumentvalues: servicetemplatecommandargumentvalues,
                            servicetemplate_id: this.memoryPoolServiceTemplate.id
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
