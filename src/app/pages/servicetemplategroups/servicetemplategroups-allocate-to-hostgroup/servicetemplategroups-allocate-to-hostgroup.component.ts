import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent,
    ProgressBarComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';
import {
    AllocateToHostGroupGet,
    AllocateToHostGroupGetHostsWithServicetemplatesForDeploy,
    AllocateToHostGroupGetService,
    AllocateToHostgroupPost,
    LoadHostgroupsByString,
    LoadHostGroupsByStringHostgroup,
    LoadServicetemplategroupsByString,
    ServiceTemplateGroupsIndexParams
} from '../servicetemplategroups.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { ServicetemplategroupsService } from '../servicetemplategroups.service';
import { MatTooltip } from '@angular/material/tooltip';
import { GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { NotyService } from "../../../layouts/coreui/noty.service";
import { MultiSelectComponent } from "../../../layouts/primeng/multi-select/multi-select/multi-select.component";
import { SelectComponent } from "../../../layouts/primeng/select/select/select.component";
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-servicetemplategroups-allocate-to-hostgroup',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NgSelectModule,
        PermissionDirective,
        RequiredIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        AlertComponent,
        FaStackComponent,
        RowComponent,
        ColComponent,
        MatTooltip,
        TranslocoPipe,
        ProgressBarComponent,
        RouterLink,
        JsonPipe,
        MultiSelectComponent,
        SelectComponent,
        FaStackItemSizeDirective
    ],
    templateUrl: './servicetemplategroups-allocate-to-hostgroup.component.html',
    styleUrl: './servicetemplategroups-allocate-to-hostgroup.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicetemplategroupsAllocateToHostgroupComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly ServicetemplategroupsService: ServicetemplategroupsService = inject(ServicetemplategroupsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly router: Router = inject(Router);

    protected selectedItems: DeleteAllItem[] = [];
    protected hideFilter: boolean = true;
    protected servicetemplategroups: SelectKeyValue[] = [];
    protected hostgroups: LoadHostGroupsByStringHostgroup[] = [];
    protected hostsWithServicetemplatesForDeploy: AllocateToHostGroupGetHostsWithServicetemplatesForDeploy[] = [];
    protected isProcessing: boolean = false;
    protected errors: GenericValidationError = {} as GenericValidationError;
    protected params: ServiceTemplateGroupsIndexParams = {} as ServiceTemplateGroupsIndexParams;
    protected servicetemplategroupId: number = 0;
    protected hostgroupId: number | null = null;
    protected percentage: number = 42;

    public ngOnInit() {
        this.servicetemplategroupId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadServicetemplategroups('');
        this.loadHostgroups('');
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }


    private loadServices(): void {
        if (this.servicetemplategroupId === null || this.hostgroupId === null) {
            return;
        }
        this.ServicetemplategroupsService.allocateToHostgroupGet(this.servicetemplategroupId, this.hostgroupId).subscribe(
            (result: AllocateToHostGroupGet): void => {
                this.cdr.markForCheck();
                this.hostsWithServicetemplatesForDeploy = result.hostsWithServicetemplatesForDeploy
            }
        )
    }

    protected hostGroupIdChanged(): void {
        this.loadServices();
    }

    protected handleHostSelect(hostIndex: number, areAllCreateServiceOnTargetHostTrue: boolean, services: AllocateToHostGroupGetService[]): void {
        for (let serviceIndex in services) {
            this.hostsWithServicetemplatesForDeploy[hostIndex].services[serviceIndex].createServiceOnTargetHost = !areAllCreateServiceOnTargetHostTrue;
        }
        this.cdr.markForCheck();
    }

    protected selectAll(): void {

        if (typeof this.hostsWithServicetemplatesForDeploy === "undefined") {
            return;
        }

        for (var hostIndex in this.hostsWithServicetemplatesForDeploy) {
            for (var serviceIndex in this.hostsWithServicetemplatesForDeploy[hostIndex].services) {
                this.hostsWithServicetemplatesForDeploy[hostIndex].services[serviceIndex].createServiceOnTargetHost = true;
            }
            this.handleServiceCheckboxClick(this.hostsWithServicetemplatesForDeploy[hostIndex].host.id);
        }
    }

    protected undoSelection(): void {

        if (typeof this.hostsWithServicetemplatesForDeploy === "undefined") {
            return;
        }

        for (var hostIndex in this.hostsWithServicetemplatesForDeploy) {
            for (var serviceIndex in this.hostsWithServicetemplatesForDeploy[hostIndex].services) {
                this.hostsWithServicetemplatesForDeploy[hostIndex].services[serviceIndex].createServiceOnTargetHost = false;
            }
            this.handleServiceCheckboxClick(this.hostsWithServicetemplatesForDeploy[hostIndex].host.id);
        }
    }


    protected allocateToHostgroup(): void {
        let i = 0;
        let count = this.hostsWithServicetemplatesForDeploy.length;
        this.isProcessing = true;

        for (var hostIndex in this.hostsWithServicetemplatesForDeploy) {
            var hostId = this.hostsWithServicetemplatesForDeploy[hostIndex].host.id;

            var servicetemplateIds = [];
            for (var serviceIndex in this.hostsWithServicetemplatesForDeploy[hostIndex].services) {
                if (this.hostsWithServicetemplatesForDeploy[hostIndex].services[serviceIndex].createServiceOnTargetHost) {
                    servicetemplateIds.push(this.hostsWithServicetemplatesForDeploy[hostIndex].services[serviceIndex].servicetemplate.id);
                }
            }

            if (servicetemplateIds.length === 0) {
                i++;
                this.percentage = Math.round(i / count * 100);
                continue;
            }

            let item: AllocateToHostgroupPost =
                {
                    Host: {
                        id: hostId
                    },
                    Servicetemplates: {
                        _ids: servicetemplateIds
                    }
                };
            this.subscriptions.add(this.ServicetemplategroupsService.allocateToHost(this.servicetemplategroupId, item)
                .subscribe((result: GenericResponseWrapper) => {
                    this.cdr.markForCheck();
                    if (result.success) {
                        i++;
                        this.percentage = Math.round(i / count * 100);

                        if (i === count) {
                            this.notyService.genericSuccess();
                            this.HistoryService.navigateWithFallback(['/services/notMonitored']);
                        }
                        return;
                    }

                    // Error
                    this.notyService.genericError();
                    const errorResponse: GenericValidationError = result.data as GenericValidationError;
                    if (result) {
                        this.errors = errorResponse;
                    }
                })
            );
        }
    }

    protected handleServiceCheckboxClick(hostId: number): void {
        const host = this.hostsWithServicetemplatesForDeploy.find(host => host.host.id === hostId);

        if (!host) {
            return;
        }
        let isAllChecked = true;

        for (const service of host.services) {
            if (!service.createServiceOnTargetHost) {
                isAllChecked = false;
                break;
            }
        }

        host.areAllCreateServiceOnTargetHostTrue = isAllChecked;
    }

    /*******************
     * ARROW functions *
     *******************/
    protected loadServicetemplategroups = (containerName: string): void => {
        this.subscriptions.add(this.ServicetemplategroupsService.loadServicetemplategroupsByString(containerName)
            .subscribe((result: LoadServicetemplategroupsByString): void => {
                this.servicetemplategroups = result.servicetemplategroups;
                this.cdr.markForCheck();
            }))
    }

    protected loadHostgroups = (containerName: string): void => {
        this.subscriptions.add(this.ServicetemplategroupsService.loadHostgroupsByString(containerName)
            .subscribe((result: LoadHostgroupsByString): void => {
                this.hostgroups = result.hostgroups;
                this.cdr.markForCheck();
            }))
    }

}
