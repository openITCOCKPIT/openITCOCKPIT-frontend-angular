import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';

import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { HostescalationContainerResult, HostescalationPost } from '../hostescalations.interface';
import { HostescalationsService } from '../hostescalations.service';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { PermissionsService } from '../../../permissions/permissions.service';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { NgIf } from '@angular/common';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { IntervalInputComponent } from '../../../layouts/coreui/interval-input/interval-input.component';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { TrueFalseDirective } from '../../../directives/true-false.directive';

@Component({
    selector: 'oitc-hostescalations-add',
    standalone: true,
    imports: [
        CoreuiComponent,
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FormDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        PaginatorModule,
        XsButtonDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        NgIf,
        RequiredIconComponent,
        SelectComponent,
        MultiSelectComponent,
        InputGroupComponent,
        InputGroupTextDirective,
        FormControlDirective,
        FormCheckLabelDirective,
        IntervalInputComponent,
        LabelLinkComponent,
        FormCheckInputDirective,
        TrueFalseDirective,
        CardFooterComponent
    ],
    templateUrl: './hostescalations-add.component.html',
    styleUrl: './hostescalations-add.component.css'
})
export class HostescalationsAddComponent implements OnInit, OnDestroy {
    public containers: HostescalationContainerResult | undefined;
    public post: HostescalationPost = {} as HostescalationPost;
    public hosts: SelectKeyValue[] = [];
    public hosts_excluded: SelectKeyValue[] = [];
    public hostgroups: SelectKeyValue[] = [];
    public timeperiods: SelectKeyValue[] = [];
    public contacts: SelectKeyValue[] = [];
    public contactgroups: SelectKeyValue[] = [];
    public errors: GenericValidationError | null = null;

    private readonly HostescalationsService = inject(HostescalationsService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private router: Router = inject(Router);

    private subscriptions: Subscription = new Subscription();

    constructor(private route: ActivatedRoute) {
        this.loadHosts = this.loadHosts.bind(this); // IMPORTANT for the searchCallback the use the same "this" context
    }


    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            //Fire on page load
            this.loadContainers();
            this.post = this.getDefaultPost();
        });
    }

    public ngOnDestroy(): void {
    }

    private getDefaultPost(): HostescalationPost {
        return {
            container_id: null,
            first_notification: 1,
            last_notification: 5,
            notification_interval: 7200,
            timeperiod_id: null,
            escalate_on_recovery: 0,
            escalate_on_down: 0,
            escalate_on_unreachable: 0,
            contacts: {
                _ids: []
            },
            contactgroups: {
                _ids: []
            },
            hosts: {
                _ids: []
            },
            hosts_excluded: {
                _ids: []
            },
            hostgroups: {
                _ids: []
            },
            hostgroups_excluded: {
                _ids: []
            }
        };
    }

    public loadContainers() {
        this.subscriptions.add(this.HostescalationsService.loadContainers()
            .subscribe((result) => {
                this.containers = result;
            })
        );
    }

    private loadElements() {
        const containerId = this.post.container_id;

        if (!containerId) {
            return;
        }

        this.subscriptions.add(this.HostescalationsService.loadElements(containerId)
            .subscribe((result) => {
                this.hosts = result.hosts;
                /*
                this.hosts = this.hosts.map(obj => ({
                    ...obj,
                    disabled: true
                }));

                 */
                this.hosts_excluded = this.hosts;
                this.hostgroups = result.hostgroups;
                this.timeperiods = result.timeperiods;
                this.contacts = result.contacts;
                this.contactgroups = result.contactgroups;
            })
        );
    }

    public loadHosts(searchString: string) {
        const containerId = this.post.container_id;
        if (!containerId) {
            return;
        }
        this.subscriptions.add(this.HostescalationsService.loadHosts(containerId, searchString, this.post.hosts._ids)
            .subscribe((result) => {
                this.hosts = result.hosts;
               /*
                this.hosts = this.hosts.map(obj => ({
                    ...obj,
                    disabled: false
                }));

                */
            })
        );
    }

    public onContainerChange() {
        this.loadElements();
    }

    public submit() {
        this.subscriptions.add(this.HostescalationsService.add(this.post)
            .subscribe((result) => {
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Host escalation');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['hostescalations', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    this.post = this.getDefaultPost();
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            })
        );
    }
}
