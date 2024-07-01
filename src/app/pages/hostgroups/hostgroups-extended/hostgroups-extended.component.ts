import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    DropdownDividerDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective, ModalService,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { FormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NgIf } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HostgroupsService } from '../hostgroups.service';
import { HostgroupExtended, HostgroupsEditGet } from '../hostgroups.interface';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import {
    ServiceMaintenanceModalComponent
} from '../../../components/services/service-maintenance-modal/service-maintenance-modal.component';
import {
    ServiceResetChecktimeModalComponent
} from '../../../components/services/service-reset-checktime-modal/service-reset-checktime-modal.component';
import { HostRescheduleItem, ServiceDowntimeItem, ServiceResetItem } from '../../../services/external-commands.service';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { NotyService } from '../../../layouts/coreui/noty.service';

@Component({
    selector: 'oitc-hostgroups-extended',
    standalone: true,
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormLoaderComponent,
        FormsModule,
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        NgIf,
        PaginatorModule,
        PermissionDirective,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        DropdownDividerDirective,
        ServiceMaintenanceModalComponent,
        ServiceResetChecktimeModalComponent
    ],
    templateUrl: './hostgroups-extended.component.html',
    styleUrl: './hostgroups-extended.component.css'
})
export class HostgroupsExtendedComponent implements OnInit, OnDestroy {

    private readonly HostgroupsService: HostgroupsService = inject(HostgroupsService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly modalService: ModalService = inject(ModalService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);

    protected hostgroupId: number = 0;
    protected hostgroups: SelectKeyValue[] = [];
    protected hostgroupExtended: HostgroupExtended = {} as HostgroupExtended;


    constructor() {
    }

    public ngOnInit() {
        // Fetch the id from the URL
        this.hostgroupId = Number(this.route.snapshot.paramMap.get('id'));

        // Load all hostgroups for the dropdown
        this.loadHostgroups();
    }

    protected onHostgroupChange(): void {
        // Load the hostgroup extended info
        this.loadHostgroupExtended();

        // Load additional information
        this.loadAdditionalInformation();
    }

    public selectedItems: any[] = [];

    public toggleResetCheckModal() {
        this.selectedItems = this.hostgroupExtended.Hosts.map((host) => {
            return {
                command: 'rescheduleHost',
                hostUuid: host.Host.uuid,
                type: '',
                satelliteId: 0
            };
        });
        console.log(this.selectedItems);

        this.modalService.toggle({
            show: true,
            id: 'serviceResetChecktimeModal'
        });
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    public onResetChecktime(success: boolean) {
        if (!success) {
            this.notyService.genericWarning();
            return;
        }
        this.notyService.genericSuccess();
        // Reload page content?
        this.ngOnInit();
    }

    private loadHostgroupExtended(): void {
        this.subscriptions.add(this.HostgroupsService.loadHostgroupWithHostsById(this.hostgroupId)
            .subscribe((result: HostgroupExtended) => {
                // Then put post where it belongs. Also unpack that bullshit
                this.hostgroupExtended = result;
            }));
    }

    private loadHostgroups(): void {
        this.subscriptions.add(this.HostgroupsService.loadHostgroupsByString('')
            .subscribe((result: SelectKeyValue[]) => {
                // Put the hostgroups to the instance
                this.hostgroups = result;

                // Then load the selected data.
                this.onHostgroupChange();
            }));
    }

    private loadAdditionalInformation(): void {
        this.subscriptions.add(this.HostgroupsService.loadAdditionalInformation(this.hostgroupId)
            .subscribe((result: any) => {
            }));
    }

    public ngOnDestroy() {

    }

}
