import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckComponent,
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
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { IntervalInputComponent } from '../../../layouts/coreui/interval-input/interval-input.component';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NgIf } from '@angular/common';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {
    HostdependencyContainerResult,
    HostdependencyGet,
    HostdependencyPost
} from '../../hostdependencies/hostdependencies.interface';
import { HostdependenciesService } from '../hostdependencies.service';

import { SelectKeyValue, SelectKeyValueWithDisabled } from '../../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { PermissionsService } from '../../../permissions/permissions.service';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { HistoryService } from '../../../history.service';
import { ObjectUuidComponent } from '../../../layouts/coreui/object-uuid/object-uuid.component';


@Component({
    selector: 'oitc-hostdependencies-edit',
    standalone: true,
    imports: [

        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        IntervalInputComponent,
        LabelLinkComponent,
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        NgIf,
        RequiredIconComponent,
        SelectComponent,
        TrueFalseDirective,
        XsButtonDirective,
        FormCheckComponent,
        BadgeComponent,
        FormLoaderComponent,
        ObjectUuidComponent
    ],
    templateUrl: './hostdependencies-edit.component.html',
    styleUrl: './hostdependencies-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostdependenciesEditComponent implements OnInit, OnDestroy {
    public containers: HostdependencyContainerResult | undefined;
    public post!: HostdependencyPost;
    public get!: HostdependencyGet;
    public hosts: SelectKeyValueWithDisabled[] = [];
    public hosts_dependent: SelectKeyValueWithDisabled[] = [];
    public hostgroups: SelectKeyValueWithDisabled[] = [];
    public hostgroups_dependent: SelectKeyValueWithDisabled[] = [];
    public timeperiods: SelectKeyValue[] = [];

    public errors: GenericValidationError | null = null;

    private readonly HostdependenciesService = inject(HostdependenciesService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    constructor(private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.HostdependenciesService.getEdit(id)
            .subscribe((result) => {
                this.cdr.markForCheck();

                this.get = result.hostdependency;
                this.post = {
                    id: this.get.id,
                    uuid: this.get.uuid,
                    container_id: this.get.container_id,
                    inherits_parent: this.get.inherits_parent,
                    timeperiod_id: this.get.timeperiod_id,
                    execution_fail_on_up: this.get.execution_fail_on_up,
                    execution_fail_on_down: this.get.execution_fail_on_down,
                    execution_fail_on_unreachable: this.get.execution_fail_on_unreachable,
                    execution_fail_on_pending: this.get.execution_fail_on_pending,
                    execution_none: this.get.execution_none,
                    notification_fail_on_up: this.get.notification_fail_on_up,
                    notification_fail_on_down: this.get.notification_fail_on_down,
                    notification_fail_on_unreachable: this.get.notification_fail_on_unreachable,
                    notification_fail_on_pending: this.get.notification_fail_on_pending,
                    notification_none: this.get.notification_none,
                    hosts: {
                        _ids: this.get.hosts.filter(obj => obj._joinData.dependent === 0).map(obj => obj.id)
                    },
                    hosts_dependent: {
                        _ids: this.get.hosts.filter(obj => obj._joinData.dependent === 1).map(obj => obj.id)
                    },
                    hostgroups: {
                        _ids: this.get.hostgroups.filter(obj => obj._joinData.dependent === 0).map(obj => obj.id)
                    },
                    hostgroups_dependent: {
                        _ids: this.get.hostgroups.filter(obj => obj._joinData.dependent === 1).map(obj => obj.id)
                    }
                };

                this.loadContainers();
                this.loadElements();
            })
        );
    }

    public loadContainers() {
        this.subscriptions.add(this.HostdependenciesService.loadContainers()
            .subscribe((result) => {
                this.containers = result;
                this.cdr.markForCheck();
            })
        );
    }

    private loadElements() {
        const containerId = this.post.container_id;

        if (!containerId) {
            return;
        }

        this.subscriptions.add(this.HostdependenciesService.loadElements(containerId)
            .subscribe((result) => {
                this.cdr.markForCheck();
                this.hosts = result.hosts;
                this.hosts_dependent = result.hostsDependent;
                this.hostgroups = result.hostgroups;
                this.hostgroups_dependent = result.hostgroupsDependent;
                this.timeperiods = result.timeperiods;

                this.processChosenHosts();
                this.processChosenDependentHosts();
                this.processChosenHostgroups();
                this.processChosenDependentHostgroups();
            })
        );
    }

    public loadHosts = (searchString: string) => {
        const containerId = this.post.container_id;
        if (!containerId) {
            return;
        }
        this.subscriptions.add(this.HostdependenciesService.loadHosts(containerId, searchString, this.post.hosts._ids)
            .subscribe((result) => {
                +
                    this.cdr.markForCheck();
                this.hosts = result.hosts;
                this.hosts = this.hosts.map(obj => ({
                    ...obj,
                    disabled: this.post.hosts_dependent._ids.includes(obj.key)
                }));
            })
        );
    }

    public loadDependentHosts = (searchString: string) => {
        const containerId = this.post.container_id;
        if (!containerId) {
            return;
        }

        this.subscriptions.add(this.HostdependenciesService.loadDependentHosts(containerId, searchString, this.post.hosts_dependent._ids)
            .subscribe((result) => {
                this.cdr.markForCheck();
                this.hosts_dependent = result.hosts;
                this.hosts_dependent = this.hosts_dependent.map(obj => {
                    return {
                        ...obj,
                        disabled: this.post.hosts._ids.includes(obj.key)
                    }
                });
            }));
    }

    public onContainerChange() {
        this.loadElements();
    }

    public processChosenHosts() {
        this.cdr.markForCheck();
        if (this.hosts.length === 0) {
            return;
        }
        for (let key in this.hosts) {
            this.hosts[key].disabled = this.post.hosts_dependent._ids.includes(this.hosts[key].key);
        }
    }

    public processChosenDependentHosts() {
        this.cdr.markForCheck();
        if (this.hosts_dependent.length === 0) {
            return;
        }

        for (let key in this.hosts_dependent) {
            this.hosts_dependent[key].disabled = this.post.hosts._ids.includes(this.hosts_dependent[key].key);
        }
    }

    public processChosenHostgroups() {
        this.cdr.markForCheck();
        if (this.hostgroups.length === 0) {
            return;
        }
        for (let key in this.hostgroups) {
            this.hostgroups[key].disabled = this.post.hostgroups_dependent._ids.includes(this.hostgroups[key].key);
        }
    }

    public processChosenDependentHostgroups() {
        this.cdr.markForCheck();
        if (this.hostgroups_dependent.length === 0) {
            return;
        }
        for (let key in this.hostgroups_dependent) {
            this.hostgroups_dependent[key].disabled = this.post.hostgroups._ids.includes(this.hostgroups_dependent[key].key);
        }
    }

    private getDefaultPost(): HostdependencyPost {
        return {
            container_id: null,
            inherits_parent: 0,
            timeperiod_id: null,
            execution_fail_on_up: 1,
            execution_fail_on_down: 1,
            execution_fail_on_unreachable: 1,
            execution_fail_on_pending: 1,
            execution_none: 0,
            notification_fail_on_up: 1,
            notification_fail_on_down: 1,
            notification_fail_on_unreachable: 1,
            notification_fail_on_pending: 1,
            notification_none: 0,
            hosts: {
                _ids: []
            },
            hosts_dependent: {
                _ids: []
            },
            hostgroups: {
                _ids: []
            },
            hostgroups_dependent: {
                _ids: []
            }
        };
    }

    public submit() {
        this.subscriptions.add(this.HostdependenciesService.edit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Host dependency');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['hostdependencies', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    this.HistoryService.navigateWithFallback(['/hostdependencies/index']);
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

    public ngOnDestroy(): void {
    }

    public checkExecutionFailureCriteria() {
        this.post.execution_none = (this.post.execution_fail_on_up | this.post.execution_fail_on_down | this.post.execution_fail_on_unreachable |
            this.post.execution_fail_on_pending) ? 0 : 1;
    }

    public resetExecutionOnFailureCriteria() {
        if (this.post.execution_none === 1) {
            this.post.execution_fail_on_up = 0;
            this.post.execution_fail_on_down = 0;
            this.post.execution_fail_on_unreachable = 0;
            this.post.execution_fail_on_pending = 0;
        } else {
            this.post.execution_fail_on_up = 1;
            this.post.execution_fail_on_down = 1;
            this.post.execution_fail_on_unreachable = 1;
            this.post.execution_fail_on_pending = 1;
        }
    }

    public checkNotificationFailureCriteria() {
        this.post.notification_none = (this.post.notification_fail_on_up | this.post.notification_fail_on_down | this.post.notification_fail_on_unreachable |
            this.post.notification_fail_on_pending) ? 0 : 1;
    }

    public resetNotificationOnFailureCriteria() {
        if (this.post.notification_none === 1) {
            this.post.notification_fail_on_up = 0;
            this.post.notification_fail_on_down = 0;
            this.post.notification_fail_on_unreachable = 0;
            this.post.notification_fail_on_pending = 0;
        } else {
            this.post.notification_fail_on_up = 1;
            this.post.notification_fail_on_down = 1;
            this.post.notification_fail_on_unreachable = 1;
            this.post.notification_fail_on_pending = 1;
        }
    }
}
