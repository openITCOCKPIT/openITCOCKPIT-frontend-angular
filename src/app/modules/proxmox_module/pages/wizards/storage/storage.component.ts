import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import {
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormControlDirective,
    FormLabelDirective,
    RowComponent
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
import {
    ProxmoxStorageWizardGet,
    ProxmoxStorageWizardPost,
    StorageServiceTemplate
} from './proxmox-storage-wizard.interface';
import { ProxmoxStorageWizardService } from './proxmox-storage-wizard.service';

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
        AlertComponent,
        ColComponent,
        RowComponent
    ],
    templateUrl: './storage.component.html',
    styleUrl: './storage.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorageComponent extends WizardsAbstractComponent {


    @ViewChild(WizardsDynamicfieldsComponent) childComponentLocal!: WizardsDynamicfieldsComponent;
    protected override WizardService: ProxmoxStorageWizardService = inject(ProxmoxStorageWizardService);
    public checked: boolean = false;

    protected override post: ProxmoxStorageWizardPost = {
        pveUsername: '',
        pveApiTokenName: '',
        pveApiTokenSecret: '',
// Default fields from the base wizard
        host_id: 0,
        services: [],
    } as ProxmoxStorageWizardPost;

    protected storageServicetemplate: StorageServiceTemplate = {} as StorageServiceTemplate;

    protected override wizardLoad(result: ProxmoxStorageWizardGet): void {
        this.cdr.markForCheck();
        this.post.services = [];
        this.post.pveUsername = result.pveUsername;
        this.post.pveApiTokenName = result.pveApiTokenName;
        this.post.pveApiTokenSecret = result.pveApiTokenSecret;
        this.storageServicetemplate = result.servicetemplates[0];
        super.wizardLoad(result);
    }


    protected runStorageDiscovery(): void {
        this.post.services = [];
        this.cdr.markForCheck();
        this.WizardService.executeStorageDiscovery(this.post).subscribe((data: any) => {
            this.post.services = [];
            this.errors = {} as GenericValidationError;
//            this.accordionClosed = true;
            this.cdr.markForCheck();
            // Error
            if (data && data.services && data.services.length && data.services[0].value && data.services[2]) {
                for (let key in data.services[2].value) {
                    let servicetemplatecommandargumentvalues = JSON.parse(JSON.stringify(this.storageServicetemplate.servicetemplatecommandargumentvalues));
                    servicetemplatecommandargumentvalues[3].value = data.services[2].value[key].name;
                    let name = "PVE Storage Usage " + String(data.services[2].value[key].name);
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
