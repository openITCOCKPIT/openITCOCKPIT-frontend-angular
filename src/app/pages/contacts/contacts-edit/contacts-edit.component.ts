import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    AlertComponent,
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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { MacrosComponent } from '../../../components/macros/macros.component';
import { AsyncPipe } from '@angular/common';
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
} from '../contacts.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { LoadUsersByContainerIdRoot } from '../../users/users.interface';
import { Subscription } from 'rxjs';
import { ContactsService } from '../contacts.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ObjectUuidComponent } from '../../../layouts/coreui/object-uuid/object-uuid.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { ObjectTypesEnum } from '../../changelogs/object-types.enum';
import { LabelLinkComponent } from "../../../layouts/coreui/label-link/label-link.component";
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { SelectKeyValue } from "../../../layouts/primeng/select.interface";
import { HistoryService } from '../../../history.service';
import { PushNotificationsService } from '../../../services/push-notifications.service';
import _ from 'lodash';
import { PermissionsService } from '../../../permissions/permissions.service';

@Component({
    selector: 'oitc-contacts-edit',
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
        FormLoaderComponent,
        AlertComponent,
        AsyncPipe
    ],
    templateUrl: './contacts-edit.component.html',
    styleUrl: './contacts-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsEditComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription = new Subscription();
    private ContactService: ContactsService = inject(ContactsService);
    private PushNotificationsService: PushNotificationsService = inject(PushNotificationsService);
    protected users: SelectKeyValue[] = [];
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
    protected timeperiods: SelectKeyValue[] = [];
    protected hasMacroErrors: boolean = false;

    protected requiredContainers: number[] = [];
    protected requiredContainersString: string = '';
    protected requiredContainersList: SelectKeyValue[] = []
    protected id: number = 0;
    protected selectedContainers: number[] = [];
    protected containersSelection: number[] = [];
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    public pushNotificationConnected: boolean | undefined;
    public pushNotificationHasPermission: boolean | undefined;
    public PermissionsService = inject(PermissionsService);
    private init: boolean = true;

    public ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadContact();
    }

    public loadContact() {
        this.subscriptions.add(this.ContactService.getEdit(this.id)
            .subscribe((result) => {
                this.cdr.markForCheck();
                this.post = result.contact.Contact;
                this.requiredContainers = result.requiredContainers;
                this.requiredContainersString = this.requiredContainers.join(',');
                this.areContainersChangeable = result.areContainersChangeable;

                // Force empty container selection.
                this.selectedContainers = this.post.containers._ids;
                this.loadContainers();
                this.loadCommands();
                this.onContainerChange();
                this.init = false;
            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public updateContact(): void {

        //update container ids if it was edited
        if (this.areContainersChangeable) {
            this.post.containers._ids = this.post.containers._ids.filter((containerId) => {
                this.containersSelection.forEach((selectedContainerId) => {
                    return containerId !== selectedContainerId;
                });
                return false;
            });
        }

        this.post.containers._ids = _.uniq(
            this.post.containers._ids.concat(this.containersSelection).concat(this.requiredContainers)
        );
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
                this.containersSelection = [];
                this.requiredContainersList = [];
                this.containers = result.containers;
                this.post.containers._ids.forEach(value => {
                    let permittetCheck = this.containers.find(({key}) => key === value);
                    if (permittetCheck && this.requiredContainers.indexOf(value) === -1) {
                        this.containersSelection.push(value);
                    }
                });

                this.requiredContainers.forEach(value => {
                    let existsCheck = this.containers.find(({key}) => key === value);
                    if (existsCheck) {
                        this.requiredContainersList.push({
                            key: value,
                            value: existsCheck.value
                        });
                    } else {
                        this.requiredContainersList.push({
                            key: value,
                            value: this.TranslocoService.translate('RESTRICTED CONTAINER')
                        });
                    }
                });

                this.cdr.markForCheck();
            }));
    }

    private loadUsers() {
        if (this.post.containers._ids.concat(this.containersSelection).concat(this.requiredContainers).length === 0) {
            this.users = [];
            this.cdr.markForCheck();
            return;
        }

        //update container ids if it was edited
        if (this.areContainersChangeable && !this.init) {
            this.post.containers._ids = this.post.containers._ids.filter((containerId) => {
                this.containersSelection.forEach((selectedContainerId) => {
                    return containerId !== selectedContainerId;
                });
                return false;
            });
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

        //update container ids if it was edited
        if (this.areContainersChangeable && !this.init) {
            this.post.containers._ids = this.post.containers._ids.filter((containerId) => {
                this.containersSelection.forEach((selectedContainerId) => {
                    return containerId !== selectedContainerId;
                });
                return false;
            });
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

        if (!this.post.service_push_notifications_enabled) {
            this.pushNotificationHasPermission = undefined;
            this.pushNotificationConnected = undefined;
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

        if (!this.post.host_push_notifications_enabled) {
            this.pushNotificationHasPermission = undefined;
            this.pushNotificationConnected = undefined;
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

    protected checkPushNotificationSettings(): void {
        if (!this.pushNotificationHasPermission) {
            this.PushNotificationsService.checkPermissions();
        }
        this.pushNotificationConnected = this.PushNotificationsService.isConnected();
        this.pushNotificationHasPermission = this.PushNotificationsService.hasPermission();
        if (this.pushNotificationConnected && this.pushNotificationHasPermission) {
            this.PushNotificationsService.sendTestMessage();
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
