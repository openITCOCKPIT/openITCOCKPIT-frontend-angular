import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
    NavComponent,
    NavItemComponent,
    TooltipDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { MacrosComponent } from '../../../components/macros/macros.component';
import { NgForOf, NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {
    Contact,
    LoadCommandsRoot,
    LoadContainersRoot,
    LoadTimeperiodsPost,
    LoadTimeperiodsRoot,
    Timeperiod
} from '../contacts.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { LoadUsersByContainerIdRoot, UserByContainer } from '../../users/users.interface';
import { Subscription } from 'rxjs';
import { ContactsService } from '../contacts.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ObjectUuidComponent } from '../../../layouts/coreui/object-uuid/object-uuid.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { ObjectTypesEnum } from '../../changelogs/object-types.enum';
import { LabelLinkComponent } from "../../../layouts/coreui/label-link/label-link.component";
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { SelectKeyValue } from "../../../layouts/primeng/select.interface";
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-contacts-edit',
    standalone: true,
    imports: [
        BackButtonDirective,
        BadgeComponent,
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
        MacrosComponent,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NgSelectModule,
        ObjectUuidComponent,
        PermissionDirective,
        RequiredIconComponent,
        RouterLink,
        TooltipDirective,
        TranslocoDirective,
        XsButtonDirective,
        MultiSelectComponent,
        SelectComponent,
        LabelLinkComponent,
        FormLoaderComponent
    ],
    templateUrl: './contacts-edit.component.html',
    styleUrl: './contacts-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsEditComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription = new Subscription();
    private ContactService: ContactsService = inject(ContactsService);
    protected users: UserByContainer[] = [];
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    public errors: GenericValidationError = {} as GenericValidationError;
    protected areContainersChangeable: boolean = true;

    public post!: Contact;

    protected containers: SelectKeyValue[] = [];
    private route = inject(ActivatedRoute);
    private hostPushCommandId: number = 0;
    private servicePushCommandId: number = 0;
    protected notificationCommands: SelectKeyValue[] = [];
    protected timeperiods: Timeperiod[] = [];
    protected hasMacroErrors: boolean = false;

    protected requiredContainers: number[] = [];
    protected requiredContainersString: string = '';
    protected allContainers: SelectKeyValue[] = []
    protected requiredContainersList: SelectKeyValue[] = []
    protected contactId: number = 0;
    protected selectedContainers: number[] = [];
    protected containersSelection: number[] = [];
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.loadCommands();
        this.contactId = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.ContactService.getEdit(this.contactId)
            .subscribe((result) => {
                this.cdr.markForCheck();
                // Then put post where it belongs. Also unpack that bullshit
                this.post = result.contact.Contact;
                this.requiredContainers = result.requiredContainers;
                this.requiredContainersString = this.requiredContainers.join(',');
                this.areContainersChangeable = result.areContainersChangeable;

                this.onContainerChange();

                // Force empty container selection.
                this.selectedContainers = this.post.containers._ids;
                this.post.containers._ids = [];
                this.loadContainers();
            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public updateContact(): void {

        this.post.containers._ids = this.post.containers._ids.concat(this.containersSelection).concat(this.requiredContainers);
        this.subscriptions.add(this.ContactService.updateContact(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response: GenericIdResponse = result.data as GenericIdResponse;

                    const title: string = this.TranslocoService.translate('Contact');
                    const msg: string = this.TranslocoService.translate('updated successfully');
                    const url: (string | number)[] = ['contacts', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/contacts/index']);

                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;

                    this.hasMacroErrors = false;
                    if (typeof (this.errors['customvariables']['custom']) === "string") {
                        this.hasMacroErrors = true;
                    }
                    this.cdr.markForCheck();
                }
            })
        );
    }

    private loadContainers(): void {
        this.subscriptions.add(this.ContactService.loadContainers()
            .subscribe((result: LoadContainersRoot) => {
                this.cdr.markForCheck();
                // Fetch all containers.
                this.allContainers = result.containers;

                // Unbind the containers list for the required dropdown. Otherwise, a reference will created that adds label suffixes to all dropdowns.
                this.requiredContainersList = result.containers.splice(0, this.requiredContainers.length);

                // If no containers are required, the selectedContainers can remain where they belong.
                if (this.requiredContainers.length === 0) {
                    this.containersSelection = this.selectedContainers;
                    this.containers = this.allContainers;
                    this.cdr.markForCheck();
                    return;
                }

                let newContainers: SelectKeyValue[] = [];
                let newPostIds: number[] = [];

                // Otherwise, we need to only add the selected containers that are not required to the container list.
                for (var i in this.allContainers) {
                    let index = parseInt(i),
                        container: SelectKeyValue = this.allContainers[index];

                    // The container is required? Then skip.
                    if (this.requiredContainers.indexOf(container.key) !== -1) {
                        continue;
                    }

                    // Otherwise add to the container dropdown.
                    newContainers.push(container);

                    // And if it is selected, add it to the overwrite-array.
                    if (this.selectedContainers.indexOf(container.key) !== -1) {
                        newPostIds.push(container.key);
                    }

                }
                this.containers = newContainers;
                this.containersSelection = newPostIds;
                this.cdr.markForCheck();
            }))
    }

    private loadUsers() {
        if (this.post.containers._ids.concat(this.containersSelection).concat(this.requiredContainers).length === 0) {
            this.users = [];
            this.cdr.markForCheck();
            return;
        }
        const param = {
            containerIds: this.post.containers._ids.concat(this.containersSelection).concat(this.requiredContainers)
        };
        this.subscriptions.add(this.ContactService.loadUsersByContainerId(param)
            .subscribe((result: LoadUsersByContainerIdRoot) => {
                this.users = result.users;
                this.cdr.markForCheck();
            }))
    }


    private loadTimeperiods() {
        if (this.post.containers._ids.concat(this.containersSelection).concat(this.requiredContainers).length === 0) {
            this.timeperiods = [];
            this.cdr.markForCheck();
            return;
        }
        const param: LoadTimeperiodsPost = {
            container_ids: this.post.containers._ids.concat(this.containersSelection).concat(this.requiredContainers)
        };
        this.subscriptions.add(this.ContactService.loadTimeperiods(param).subscribe((result: LoadTimeperiodsRoot) => {
            this.timeperiods = result.timeperiods;
            this.cdr.markForCheck();
        }));
    }


    private loadCommands() {
        this.subscriptions.add(this.ContactService.loadCommands().subscribe((result: LoadCommandsRoot) => {
            this.notificationCommands = result.notificationCommands;
            this.hostPushCommandId = result.hostPushComamndId;
            this.servicePushCommandId = result.servicePushComamndId;
            this.cdr.markForCheck();
        }));
    }


    public onContainerChange(): void {
        if (this.post.containers._ids.concat(this.containersSelection).concat(this.requiredContainers).length === 0) {
            this.users = [];
            this.timeperiods = [];
            this.cdr.markForCheck();
            return;
        }
        this.loadUsers();
        this.loadTimeperiods();
    }

    // Called by (click) - no manual change detection required
    public addMacro() {
        this.post.customvariables.push({
            name: '',
            objecttype_id: ObjectTypesEnum["CONTACT"],
            password: 0,
            value: '',
        });

    }

    // Called by (click) - no manual change detection required
    protected toggleServiceBrowserCheckbox(): void {
        if (this.post.service_push_notifications_enabled !== 1) {
            if (this.post.service_commands._ids.indexOf(this.servicePushCommandId) === -1) {
                this.post.service_commands._ids = [...this.post.service_commands._ids, this.servicePushCommandId];
            }
        } else {
            if (this.post.service_commands._ids.indexOf(this.servicePushCommandId) !== -1) {
                this.post.service_commands._ids = [...this.post.service_commands._ids.filter(item => item !== this.servicePushCommandId)];
            }
        }
    }

    // Called by (click) - no manual change detection required
    protected toggleHostBrowserCheckbox(): void {
        if (this.post.host_push_notifications_enabled !== 1) {
            if (this.post.host_commands._ids.indexOf(this.hostPushCommandId) === -1) {
                this.post.host_commands._ids = [...this.post.host_commands._ids, this.hostPushCommandId];
            }
        } else {
            if (this.post.host_commands._ids.indexOf(this.hostPushCommandId) !== -1) {
                this.post.host_commands._ids = [...this.post.host_commands._ids.filter(item => item !== this.hostPushCommandId)];
            }
        }
    }

    // Called by (click) - no manual change detection required
    protected updateServiceBrowserNotification(): void {
        if (this.post.service_commands._ids.indexOf(this.servicePushCommandId) !== -1) {
            this.post.service_push_notifications_enabled = 1;
        } else {
            this.post.service_push_notifications_enabled = 0;
        }
    }

    // Called by (click) - no manual change detection required
    protected updateHostBrowserNotification(): void {
        if (this.post.host_commands._ids.indexOf(this.hostPushCommandId) !== -1) {
            this.post.host_push_notifications_enabled = 1;
        } else {
            this.post.host_push_notifications_enabled = 0;
        }
    }

    // Called by (click) - no manual change detection required
    /*******************
     * ARROW functions *
     *******************/
    protected deleteMacro = (index: number) => {
        this.post.customvariables.splice(index, 1);
    }
}
