import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckInputDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';

import { NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotyService } from '../../../layouts/coreui/noty.service';

import { HostgroupsService } from '../hostgroups.service';
import { Hostgroup, LoadContainersRoot, LoadHostsResponse, LoadHosttemplates } from "../hostgroups.interface";
import { SelectComponent } from "../../../layouts/primeng/select/select/select.component";
import { MultiSelectComponent } from "../../../layouts/primeng/multi-select/multi-select/multi-select.component";
import { SelectKeyValue } from "../../../layouts/primeng/select.interface";
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-hostgroups-add',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormCheckInputDirective,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        NgIf,
        NgSelectModule,
        PermissionDirective,
        RequiredIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        SelectComponent,
        MultiSelectComponent
    ],
    templateUrl: './hostgroups-add.component.html',
    styleUrl: './hostgroups-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostgroupsAddComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription = new Subscription();
    private HostgroupsService: HostgroupsService = inject(HostgroupsService);
    protected hosts: SelectKeyValue[] = [];
    private router: Router = inject(Router);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    public errors: GenericValidationError | null = null;
    public createAnother: boolean = false;

    public post: Hostgroup = {} as Hostgroup;
    private preselectedHostIds: number[] = [];
    protected containers: SelectKeyValue[] = [];
    protected hosttemplates: SelectKeyValue[] = [];
    private route = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    constructor() {
        this.post = this.getDefaultPost();
    }

    public ngOnInit() {
        // Load containers for dropdown.
        this.loadContainers();

        // Force hosts and hosttemplates empty if you "create another".
        this.loadHosts('');
        this.loadHosttemplates('');
        const hostIds = this.route.snapshot.paramMap.get('hostids');
        if (hostIds) {
            this.preselectedHostIds = hostIds.split(',').map(Number);
        }
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public addHostgroup(): void {

        this.subscriptions.add(this.HostgroupsService.addHostgroup(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response: GenericIdResponse = result.data as GenericIdResponse;

                    const title: string = this.TranslocoService.translate('Hostgroup');
                    const msg: string = this.TranslocoService.translate('added successfully');
                    const url: (string | number)[] = ['hostgroups', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/hostgroups/index']);
                        return;
                    }
                    this.post = this.getDefaultPost();
                    this.errors = null;
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();

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

    private loadContainers(): void {
        this.subscriptions.add(this.HostgroupsService.loadContainers()
            .subscribe((result: LoadContainersRoot) => {
                this.containers = result.containers;
                this.cdr.markForCheck();
            }))
    }

    private getDefaultPost(): Hostgroup {
        return {
            container: {
                name: '',
                parent_id: 0
            },
            description: "",
            hostgroup_url: "",
            hosts: {
                _ids: []
            },
            hosttemplates: {
                _ids: []
            }
        }
    }


    public onContainerChange(): void {
        if (!this.post.container.parent_id) {
            this.hosts = [];
            return;
        }
        this.loadHosts('');
        this.loadHosttemplates('');
    }

    // ARROW FUNCTIONS
    protected loadHosts = (search: string) => {
        if (!this.post.container.parent_id) {
            this.hosts = [];
            this.cdr.markForCheck();
            return;
        }
        this.subscriptions.add(this.HostgroupsService.loadHosts(this.post.container.parent_id, search, this.post.hosts._ids)
            .subscribe((result: LoadHostsResponse) => {
                this.hosts = result.hosts;

                // Preselect hosts if they were passed in the URL.
                if (this.preselectedHostIds.length) {
                    this.post.hosts._ids = this.preselectedHostIds;
                }
                this.cdr.markForCheck();
            }))
    }


    protected loadHosttemplates = (search: string) => {
        if (!this.post.container.parent_id) {
            this.hosttemplates = [];
            this.cdr.markForCheck();
            return;
        }
        this.subscriptions.add(this.HostgroupsService.loadHosttemplates(this.post.container.parent_id, search, this.post.hosttemplates._ids)
            .subscribe((result: LoadHosttemplates) => {
                this.hosttemplates = result.hosttemplates;
                this.cdr.markForCheck();
            }))
    }
}
