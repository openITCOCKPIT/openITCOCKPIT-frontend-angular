import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective, ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent, ProgressBarComponent, RowComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent, FaStackComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';
import {
    AllocateToHostgroup,
    AllocateToHostGroupGet,
    AllocateToHostGroupGetHostsWithServicetemplatesForDeploy, AllocateToHostGroupGetService,
    getDefaultAllocateToHostgroupPost,
    LoadHostgroupsByString,
    LoadHostGroupsByStringHostgroup,
    LoadServicetemplategroupsByString,
    LoadServicetemplategroupsByStringServicetemplategroup,
    ServiceTemplateGroupsIndexParams
} from '../servicetemplategroups.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { ServicetemplategroupsService } from '../servicetemplategroups.service';
import { MatTooltip } from '@angular/material/tooltip';
import { GenericValidationError } from '../../../generic-responses';

@Component({
    selector: 'oitc-servicetemplategroups-allocate-to-hostgroup',
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
        JsonPipe
    ],
    templateUrl: './servicetemplategroups-allocate-to-hostgroup.component.html',
    styleUrl: './servicetemplategroups-allocate-to-hostgroup.component.css'
})
export class ServicetemplategroupsAllocateToHostgroupComponent implements OnInit, OnDestroy {

    private readonly subscriptions: Subscription = new Subscription();
    private readonly ServicetemplategroupsService: ServicetemplategroupsService = inject(ServicetemplategroupsService);

    protected errors: GenericValidationError = {} as GenericValidationError;
    protected params: ServiceTemplateGroupsIndexParams = {} as ServiceTemplateGroupsIndexParams;

    protected readonly route: ActivatedRoute = inject(ActivatedRoute);
    protected selectedItems: DeleteAllItem[] = [];
    protected readonly router: Router = inject(Router);
    protected hideFilter: boolean = true;

    protected servicetemplategroups: LoadServicetemplategroupsByStringServicetemplategroup[] = [];
    protected hostgroups: LoadHostGroupsByStringHostgroup[] = [];
    protected hostsWithServicetemplatesForDeploy: AllocateToHostGroupGetHostsWithServicetemplatesForDeploy[] = [];

    protected id: number | null = null;
    protected hostgroupId: number | null = null;
    protected post: AllocateToHostgroup = getDefaultAllocateToHostgroupPost();

    protected percentage: number = 42;

    public ngOnInit() {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadServicetemplategroups();
        this.loadHostgroups();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }


    private loadServices(): void {
        if (this.id === null || this.hostgroupId === null) {
            return;
        }
        this.ServicetemplategroupsService.allocateToHostgroupGet(this.id, this.hostgroupId).subscribe(
            (result: AllocateToHostGroupGet): void => {
                this.hostsWithServicetemplatesForDeploy = result.hostsWithServicetemplatesForDeploy
            }
        )
    }

    protected hostGroupIdChanged(): void {
        this.loadServices();
    }

    private loadServicetemplategroups(): void {
        this.subscriptions.add(this.ServicetemplategroupsService.loadServicetemplategroupsByString()
            .subscribe((result: LoadServicetemplategroupsByString): void => {
                this.servicetemplategroups = result.servicetemplategroups;
            }))
    }

    private loadHostgroups(): void {
        this.subscriptions.add(this.ServicetemplategroupsService.loadHostgroupsByString()
            .subscribe((result: LoadHostgroupsByString): void => {
                this.hostgroups = result.hostgroups;
            }))
    }

    protected handleHostSelect(hostIndex: number, areAllCreateServiceOnTargetHostTrue: boolean, services: AllocateToHostGroupGetService[]): void {
        for (let serviceIndex in services) {
            this.hostsWithServicetemplatesForDeploy[hostIndex].services[serviceIndex].createServiceOnTargetHost = !areAllCreateServiceOnTargetHostTrue;
        }
    }

    protected selectAll(): void {

    }

    protected undoSelection(): void {
    }

    protected allocateToHostgroup(): void {

    }

}
