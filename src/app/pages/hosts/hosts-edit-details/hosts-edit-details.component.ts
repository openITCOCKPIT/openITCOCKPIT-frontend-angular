import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
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
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';


import { FormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { AsyncPipe, NgClass } from '@angular/common';

import { PaginatorModule } from 'primeng/paginator';
import { PermissionDirective } from '../../../permissions/permission.directive';

import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { HostsService } from '../hosts.service';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { HostEditDetailsPost } from '../hosts.interface';
import { NgSelectModule } from '@ng-select/ng-select';
import { PriorityComponent } from '../../../layouts/coreui/priority/priority.component';
import { PermissionsService } from '../../../permissions/permissions.service';
import { IntervalInputComponent } from '../../../layouts/coreui/interval-input/interval-input.component';
import {
    CheckAttemptsInputComponent
} from '../../../layouts/coreui/check-attempts-input/check-attempts-input.component';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-hosts-edit-details',
    imports: [
    BackButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FaIconComponent,
    FormDirective,
    FormLabelDirective,
    FormsModule,
    MultiSelectComponent,
    NavComponent,
    NavItemComponent,
    PaginatorModule,
    PermissionDirective,
    SelectComponent,
    TranslocoDirective,
    XsButtonDirective,
    RouterLink,
    FormLoaderComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    TranslocoPipe,
    NgClass,
    FormControlDirective,
    NgSelectModule,
    PriorityComponent,
    IntervalInputComponent,
    CheckAttemptsInputComponent,
    AsyncPipe
],
    templateUrl: './hosts-edit-details.component.html',
    styleUrl: './hosts-edit-details.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostsEditDetailsComponent implements OnInit, OnDestroy {

    public hostIds: number[] = [];
    public contacts: SelectKeyValue[] = [];
    public contactgroups: SelectKeyValue[] = [];
    public sharingContainers: SelectKeyValue[] = [];
    public satellites: SelectKeyValue[] = [];

    public isLoading: boolean = true;
    public tagsForSelect: string[] = [];
    public post: HostEditDetailsPost = {
        Host: {
            hosts_to_containers_sharing: {
                _ids: []
            },
            description: null,
            host_url: null,
            tags: null,

            check_interval: null,
            retry_interval: null,
            max_check_attempts: null,
            notification_interval: null,
            notes: null,
            priority: 0,
            satellite_id: null,
            contacts: {
                _ids: []
            },
            contactgroups: {
                _ids: []
            }
        },
        keepSharedContainers: false,
        keepContacts: false,
        keepContactgroups: false,
        editSharedContainers: false,
        editDescription: false,
        editTags: false,
        editPriority: false,
        editCheckInterval: false,
        editRetryInterval: false,
        editMaxNumberOfCheckAttempts: false,
        editNotificationInterval: false,
        editContacts: false,
        editContactgroups: false,
        editHostUrl: false,
        editNotes: false,
        editSatellites: false
    };

    public readonly PermissionsService = inject(PermissionsService);

    private subscriptions: Subscription = new Subscription();
    private HostsService = inject(HostsService);
    private readonly notyService = inject(NotyService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.isLoading = true;
        const ids = String(this.route.snapshot.paramMap.get('ids')).split(',').map(Number);
        if (!ids) {
            // No ids given
            this.router.navigate(['/', 'hosts', 'index']);
        }

        if (ids) {
            this.subscriptions.add(this.HostsService.getEditDetails(ids).subscribe(response => {
                this.cdr.markForCheck();
                this.hostIds = ids;
                this.contacts = response.contacts;
                this.contactgroups = response.contactgroups;
                this.sharingContainers = response.sharingContainers;
                this.satellites = response.satellites;

                this.isLoading = false;
            }));
        }
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public toggleEditSharedContainers() {
        this.post.editSharedContainers = !this.post.editSharedContainers;

        if (!this.post.editSharedContainers) {
            this.post.Host.hosts_to_containers_sharing._ids = [];
            this.post.keepSharedContainers = false;
        }
        this.cdr.markForCheck();
    }

    public toggleEditDescription() {
        this.post.editDescription = !this.post.editDescription;

        if (!this.post.editDescription) {
            this.post.Host.description = null;
        }
        this.cdr.markForCheck();
    }

    public toggleEditTags() {
        this.post.editTags = !this.post.editTags;

        if (!this.post.editTags) {
            this.post.Host.tags = null;
            this.tagsForSelect = [];
        }
        this.cdr.markForCheck();
    }

    public toggleEditPriority() {
        this.post.editPriority = !this.post.editPriority;

        if (!this.post.editPriority) {
            this.post.Host.priority = 0;
        } else {
            this.post.Host.priority = 1;
        }
        this.cdr.markForCheck();
    }

    public toggleEditCheckInterval() {
        this.post.editCheckInterval = !this.post.editCheckInterval;

        if (!this.post.editCheckInterval) {
            this.post.Host.check_interval = null;
        }
        this.cdr.markForCheck();
    }

    public toggleEditRetryInterval() {
        this.post.editRetryInterval = !this.post.editRetryInterval;

        if (!this.post.editRetryInterval) {
            this.post.Host.retry_interval = null;
        }
        this.cdr.markForCheck();
    }

    public toggleEditMaxNumberOfCheckAttempts() {
        this.post.editMaxNumberOfCheckAttempts = !this.post.editMaxNumberOfCheckAttempts;

        if (!this.post.editMaxNumberOfCheckAttempts) {
            this.post.Host.max_check_attempts = null;
        }
        this.cdr.markForCheck();
    }

    public toggleEditNotificationInterval() {
        this.post.editNotificationInterval = !this.post.editNotificationInterval;

        if (!this.post.editNotificationInterval) {
            this.post.Host.notification_interval = null;
        }
        this.cdr.markForCheck();
    }

    public toggleEditContacts() {
        this.post.editContacts = !this.post.editContacts;

        if (!this.post.editContacts) {
            this.post.Host.contacts._ids = [];
            this.post.keepContacts = false;
        }
        this.cdr.markForCheck();
    }

    public toggleEditContactgroups() {
        this.post.editContactgroups = !this.post.editContactgroups;

        if (!this.post.editContactgroups) {
            this.post.Host.contactgroups._ids = [];
            this.post.keepContactgroups = false;
        }
        this.cdr.markForCheck();
    }

    public toggleEditHostUrl() {
        this.post.editHostUrl = !this.post.editHostUrl;

        if (!this.post.editHostUrl) {
            this.post.Host.host_url = null;
        }
        this.cdr.markForCheck();
    }

    public toggleEditNotes() {
        this.post.editNotes = !this.post.editNotes;

        if (!this.post.editNotes) {
            this.post.Host.notes = null;
        }
        this.cdr.markForCheck();
    }

    public toggleEditSatellites() {
        this.post.editSatellites = !this.post.editSatellites;

        if (!this.post.editSatellites) {
            this.post.Host.satellite_id = null;
        }
        this.cdr.markForCheck();
    }

    public submit() {
        if (this.post.editTags) {
            this.post.Host.tags = this.tagsForSelect.join(',');
        }

        this.subscriptions.add(this.HostsService.saveEditDetails(this.post, this.hostIds)
            .subscribe((result) => {
                this.cdr.markForCheck();
                this.notyService.genericSuccess();
                this.notyService.scrollContentDivToTop();
                this.HistoryService.navigateWithFallback(['/hosts/index']);
            }));
    }

    protected readonly Number = Number;
}
