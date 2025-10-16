import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckInputDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent,
    TooltipDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';
import {
    AllocateToHostGet,
    AllocateToHostGetServicetemplatesForDeploy,
    AllocateToHostPost,
    LoadHostsByStringResponse,
    LoadServicetemplategroupsByString,
    ServiceTemplateGroupsIndexParams
} from '../servicetemplategroups.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { ServicetemplategroupsService } from '../servicetemplategroups.service';

import { GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { NotyService } from "../../../layouts/coreui/noty.service";

import { SelectComponent } from "../../../layouts/primeng/select/select/select.component";
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-servicetemplategroups-allocate-to-host',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormCheckInputDirective,
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
        TranslocoPipe,
        RouterLink,
        SelectComponent,
        TooltipDirective
    ],
    templateUrl: './servicetemplategroups-allocate-to-host.component.html',
    styleUrl: './servicetemplategroups-allocate-to-host.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicetemplategroupsAllocateToHostComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly ServicetemplategroupsService: ServicetemplategroupsService = inject(ServicetemplategroupsService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly router: Router = inject(Router);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly cdr = inject(ChangeDetectorRef);

    protected errors: GenericValidationError = {} as GenericValidationError;
    protected params: ServiceTemplateGroupsIndexParams = {} as ServiceTemplateGroupsIndexParams;
    protected selectedItems: DeleteAllItem[] = [];
    protected hideFilter: boolean = true;
    protected servicetemplategroups: SelectKeyValue[] = [];
    protected hosts: SelectKeyValue[] = [];
    protected hostsWithServicetemplatesForDeploy: AllocateToHostGetServicetemplatesForDeploy[] = [];
    protected servicetemplategroupId: number = 0;
    protected hostId: number = 0;

    public ngOnInit() {
        this.servicetemplategroupId = Number(this.route.snapshot.paramMap.get('id'));
        let hostId: number = Number(this.route.snapshot.paramMap.get('hostId'));
        if (hostId > 0) {
            this.hostId = hostId;
        }
        this.loadServicetemplategroups('');
        this.loadHosts('');
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }


    public loadServices(): void {
        if (this.servicetemplategroupId === 0 || this.hostId === 0) {
            return;
        }
        this.ServicetemplategroupsService.allocateToHostGet(this.servicetemplategroupId, this.hostId).subscribe(
            (result: AllocateToHostGet): void => {
                this.cdr.markForCheck();
                this.hostsWithServicetemplatesForDeploy = result.servicetemplatesForDeploy
            }
        )
    }

    protected selectAll(): void {
        if (typeof this.hostsWithServicetemplatesForDeploy === "undefined") {
            return;
        }
        for (let hostIndex in this.hostsWithServicetemplatesForDeploy) {
            this.hostsWithServicetemplatesForDeploy[hostIndex].createServiceOnTargetHost = true;
        }
    }

    protected undoSelection(): void {

        if (typeof this.hostsWithServicetemplatesForDeploy === "undefined") {
            return;
        }
        for (let hostIndex in this.hostsWithServicetemplatesForDeploy) {
            this.hostsWithServicetemplatesForDeploy[hostIndex].createServiceOnTargetHost = false;
        }
    }


    protected submit(): void {
        let item: AllocateToHostPost =
            {
                Host: {
                    id: this.hostId
                },
                Servicetemplates: {
                    _ids: []
                }
            };
        for (let hostIndex in this.hostsWithServicetemplatesForDeploy) {
            if (this.hostsWithServicetemplatesForDeploy[hostIndex].createServiceOnTargetHost) {
                item.Servicetemplates._ids.push(this.hostsWithServicetemplatesForDeploy[hostIndex].servicetemplate.id);
            }
        }
        this.subscriptions.add(this.ServicetemplategroupsService.allocateToHost(this.servicetemplategroupId, item)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    this.notyService.genericSuccess();
                    this.HistoryService.navigateWithFallback(['/servicetemplategroups/index']);
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

    protected loadHosts = (containerName: string): void => {
        this.subscriptions.add(this.ServicetemplategroupsService.loadHostsByString(this.hostId, containerName)
            .subscribe((result: LoadHostsByStringResponse): void => {
                this.hosts = result.hosts;
                this.cdr.markForCheck();
            }))
    }

}
