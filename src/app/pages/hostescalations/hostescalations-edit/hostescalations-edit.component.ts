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
import { HostescalationContainerResult, HostescalationGet, HostescalationPost } from '../hostescalations.interface';
import { HostescalationsService } from '../hostescalations.service';
import { SelectKeyValue, SelectKeyValueWithDisabled } from '../../../layouts/primeng/select.interface';
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
    templateUrl: './hostescalations-edit.component.html',
    styleUrl: './hostescalations-edit.component.css'
})
export class HostescalationsEditComponent implements OnInit, OnDestroy {
    public containers: HostescalationContainerResult | undefined;
    public post!: HostescalationPost;
    public get!: HostescalationGet;
    public hosts: SelectKeyValueWithDisabled[] = [];
    public hosts_excluded: SelectKeyValueWithDisabled[] = [];
    public hostgroups: SelectKeyValueWithDisabled[] = [];
    public hostgroups_excluded: SelectKeyValueWithDisabled[] = [];
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
        // IMPORTANT for the searchCallback the use the same "this" context
        this.loadHosts = this.loadHosts.bind(this);
        this.loadExcludedHosts = this.loadExcludedHosts.bind(this);
    }


    public ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.HostescalationsService.getEdit(id)
            .subscribe((result) => {
                this.get = result.hostescalation;
                this.post = {
                    id: this.get.id,
                    container_id: this.get.container_id,
                    first_notification: this.get.first_notification,
                    last_notification: this.get.last_notification,
                    notification_interval: this.get.notification_interval,
                    timeperiod_id: this.get.timeperiod_id,
                    escalate_on_recovery: this.get.escalate_on_recovery,
                    escalate_on_down: this.get.escalate_on_down,
                    escalate_on_unreachable: this.get.escalate_on_unreachable,
                    hosts: {
                        _ids: this.get.hosts.filter(obj => obj._joinData.excluded === 0).map(obj => obj.id)
                    },
                    hosts_excluded: {
                        _ids: this.get.hosts.filter(obj => obj._joinData.excluded === 1).map(obj => obj.id)
                    },
                    hostgroups: {
                        _ids: this.get.hostgroups.filter(obj => obj._joinData.excluded === 0).map(obj => obj.id)
                    },
                    hostgroups_excluded: {
                        _ids: this.get.hostgroups.filter(obj => obj._joinData.excluded === 1).map(obj => obj.id)
                    },
                    contacts: {
                        _ids: this.get.contacts.map(obj => obj.id)
                    },
                    contactgroups: {
                        _ids: this.get.contactgroups.map(obj => obj.id)
                    }
                };

                this.loadContainers();
                this.loadExcludedHosts('');
                this.loadExcludedHostgroups('');
                this.loadElements();
            })
        );

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
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
                let currentHostsIds: number[] = [];
                this.hosts = result.hosts;
                this.hosts = this.hosts.map(obj => {
                    currentHostsIds.push(obj.key);
                    return {
                        ...obj,
                        disabled: this.post.hosts_excluded._ids.includes(obj.key)
                    }
                });
                this.post.hosts._ids = this.post.hosts._ids.filter(
                    id => currentHostsIds.includes(id)
                );

                this.processChosenExcludedHosts();


                let currentHostgroupIds: number[] = [];
                this.hostgroups = result.hostgroups;
                this.hostgroups = this.hostgroups.map(obj => {
                    currentHostgroupIds.push(obj.key);
                    return {
                        ...obj,
                        disabled: this.post.hostgroups_excluded._ids.includes(obj.key)
                    }
                });
                this.post.hostgroups._ids = this.post.hostgroups._ids.filter(
                    id => currentHostgroupIds.includes(id)
                );

                this.processChosenExcludedHostgroups();
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
                let currentHostsIds: number[] = [];
                this.hosts = result.hosts;
                this.hosts = this.hosts.map(obj => {
                    currentHostsIds.push(obj.key);
                    return {
                        ...obj,
                        disabled: this.post.hosts_excluded._ids.includes(obj.key)
                    }
                });
                this.post.hosts._ids = this.post.hosts._ids.filter(
                    id => currentHostsIds.includes(id)
                );
            })
        );
    }

    public loadExcludedHosts(searchString: string) {
        const containerId = this.post.container_id;
        if (!containerId) {
            return;
        }
        if (this.post.hostgroups._ids.length === 0) {
            this.post.hosts_excluded._ids = [];
            return;
        }
        this.subscriptions.add(this.HostescalationsService.loadExcludedHosts(containerId, searchString, this.post.hosts_excluded._ids, this.post.hostgroups._ids)
            .subscribe((result) => {
                let currentHostsExcludedIds: number[] = [];
                this.hosts_excluded = result.excludedHosts;
                this.hosts_excluded = this.hosts_excluded.map(obj => {
                    currentHostsExcludedIds.push(obj.key);
                    return {
                        ...obj,
                        disabled: this.post.hosts._ids.includes(obj.key)
                    }
                });
                this.post.hosts_excluded._ids = this.post.hosts_excluded._ids.filter(
                    id => currentHostsExcludedIds.includes(id)
                );
            }));
    }

    public loadExcludedHostgroups(searchString: string) {
        const containerId = this.post.container_id;
        if (!containerId) {
            return;
        }
        if (this.post.hosts._ids.length === 0) {
            this.post.hostgroups_excluded._ids = [];
            return;
        }
        this.subscriptions.add(this.HostescalationsService.loadExcludedHostgroups(containerId, searchString, this.post.hosts._ids, this.post.hostgroups_excluded._ids)
            .subscribe((result) => {
                let currentHostGroupsExcludedIds: number[] = [];
                this.hostgroups_excluded = result.excludedHostgroups;
                this.hostgroups_excluded = this.hostgroups_excluded.map(obj => {
                    currentHostGroupsExcludedIds.push(obj.key);
                    return {
                        ...obj,
                        disabled: this.post.hostgroups._ids.includes(obj.key)
                    }
                });
                this.post.hostgroups_excluded._ids = this.post.hostgroups_excluded._ids.filter(
                    id => currentHostGroupsExcludedIds.includes(id)
                );
            }));
    }

    public onContainerChange() {
        this.loadElements();
    }

    public processChosenHosts() {
        if (this.hosts.length === 0) {
            return;
        }
        for (let key in this.hosts) {
            this.hosts[key].disabled = this.post.hosts_excluded._ids.includes(this.hosts[key].key);
        }
    }

    public processChosenExcludedHosts() {
        if (this.hosts_excluded.length === 0) {
            return;
        }

        for (let key in this.hosts_excluded) {
            this.hosts_excluded[key].disabled = this.post.hosts._ids.includes(this.hosts_excluded[key].key);
        }
    }

    public processChosenHostgroups() {
        if (this.hostgroups.length === 0) {
            return;
        }
        for (let key in this.hostgroups) {
            this.hostgroups[key].disabled = this.post.hostgroups_excluded._ids.includes(this.hostgroups[key].key);
        }
    }

    public processChosenExcludedHostgroups() {
        if (this.hostgroups_excluded.length === 0) {
            return;
        }
        for (let key in this.hostgroups_excluded) {
            this.hostgroups_excluded[key].disabled = this.post.hostgroups._ids.includes(this.hostgroups_excluded[key].key);
        }
    }


    public submit() {
        this.subscriptions.add(this.HostescalationsService.edit(this.post)
            .subscribe((result) => {
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Host escalation');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['hostescalations', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);


                    this.router.navigate(['/hostescalations/index']);
                    this.notyService.scrollContentDivToTop();
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            }));

    }
}
