import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import {
    SnapshotServicetemplate,
    VmwareSnapshotsWizardGet,
    VmwareSnapshotsWizardPost
} from './vmware-snapshots-wizard.interface';
import { VmwareSnapshotsWizardService } from './vmware-snapshots-wizard.service';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import {
    AccordionButtonDirective,
    AccordionComponent,
    AccordionItemComponent,
    AlertComponent,
    ButtonCloseDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ModalToggleDirective,
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
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-vmware-snapshots',
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
        WizardsDynamicfieldsComponent,
        TranslocoDirective,
        FormLabelDirective,
        AlertComponent,
        AccordionButtonDirective,
        AccordionComponent,
        AccordionItemComponent,
        TemplateIdDirective,
        XsButtonDirective,
        ButtonCloseDirective,
        ColComponent,
        FormDirective,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        RowComponent,
        ModalToggleDirective
    ],
    templateUrl: './vmware-snapshots.component.html',
    styleUrl: './vmware-snapshots.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VmwareSnapshotsComponent extends WizardsAbstractComponent {
    @ViewChild(WizardsDynamicfieldsComponent) childComponentLocal!: WizardsDynamicfieldsComponent;
    protected override WizardService: VmwareSnapshotsWizardService = inject(VmwareSnapshotsWizardService);

    private readonly modalService = inject(ModalService);

    protected override post: VmwareSnapshotsWizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
// Fields for the wizard
        vmwareuser: '',
        vmwarepass: '',
        vcenter: '',
        typeId: 'vmware-snapshots'
    } as VmwareSnapshotsWizardPost;

    protected snapshotServicetemplate: SnapshotServicetemplate = {} as SnapshotServicetemplate;

    static readonly SNAPSHOT_REGEX = '.*';

    protected serviceName = '';
    protected serviceRegex = VmwareSnapshotsComponent.SNAPSHOT_REGEX;
    protected serviceAlreadyExists = false;

    protected override wizardLoad(result: VmwareSnapshotsWizardGet): void {
        this.post.vmwareuser = result.vmwareuser;
        this.post.vmwarepass = result.vmwarepass;
        this.post.vcenter = result.vcenter;
        this.snapshotServicetemplate = result.snapshotServicetemplate;
        super.wizardLoad(result);
    }

    protected addNewSnapshotServiceToList(): void {

        if (this.serviceName) {
            let servicetemplatecommandargumentvalues = JSON.parse(JSON.stringify(this.snapshotServicetemplate.servicetemplatecommandargumentvalues));
            servicetemplatecommandargumentvalues[3].value = this.serviceRegex;
            this.post.services.push(
                {
                    createService: !this.isServiceAlreadyPresent(this.WizardGet.servicesNamesForExistCheck, this.serviceName),
                    description: '',
                    host_id: this.post.host_id,
                    name: this.serviceName,
                    servicecommandargumentvalues: servicetemplatecommandargumentvalues,
                    servicetemplate_id: this.snapshotServicetemplate.id
                });
            this.serviceName = '';
            this.serviceRegex = VmwareSnapshotsComponent.SNAPSHOT_REGEX;
            this.childComponentLocal.cdr.markForCheck();
            this.cdr.markForCheck();
            this.modalService.toggle({
                show: false,
                id: 'addSnapshotServiceModal',
            });
            return;
        }

        this.notyService.genericError();
        this.errors['serviceName'] = {
            '_empty': this.TranslocoService.translate('This field cannot be left empty')
        };
        this.cdr.markForCheck();

    }

    public openAddSnapshotServiceModal() {

        if (this.errors['serviceName']) {
            delete this.errors['serviceName'];
        }

        this.modalService.toggle({
            show: true,
            id: 'addSnapshotServiceModal',
        });
    };

    // callback when service name input has changed

    public onServiceNameChange(newServiceValue: string) {

        this.serviceAlreadyExists = false;
        if (newServiceValue !== "" && this.isServiceAlreadyPresent(this.WizardGet.servicesNamesForExistCheck, newServiceValue)) {
            this.serviceAlreadyExists = true;
        }

    }

}
