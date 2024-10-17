import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
    AlertComponent,
    AlertHeadingDirective,
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
    FormSelectDirective,
    NavComponent,
    NavItemComponent,
    TooltipDirective
} from "@coreui/angular";
import { XsButtonDirective } from "../../../layouts/coreui/xsbutton-directive/xsbutton.directive";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { NgForOf, NgIf } from '@angular/common';
import { RequiredIconComponent } from "../../../components/required-icon/required-icon.component";
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PermissionDirective } from "../../../permissions/permission.directive";
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { Subscription } from 'rxjs';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { MacrosComponent } from '../../../components/macros/macros.component';
import { ContactsService } from '../contacts.service';
import {
    ContactPost,
    LdapConfig,
    LdapUser,
    LoadCommandsRoot,
    LoadContainersRoot,
    LoadTimeperiodsPost,
    LoadTimeperiodsRoot,
    Timeperiod
} from '../contacts.interface';
import { LoadUsersByContainerIdRoot, UserByContainer } from '../../users/users.interface';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { ObjectTypesEnum } from '../../changelogs/object-types.enum';
import { LabelLinkComponent } from "../../../layouts/coreui/label-link/label-link.component";
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-contacts-add',
    standalone: true,
    imports: [
        AlertComponent,
        AlertHeadingDirective,
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
        FormSelectDirective,
        FormsModule,
        MacrosComponent,
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NgSelectModule,
        PermissionDirective,
        RequiredIconComponent,
        RouterLink,
        SelectComponent,
        TooltipDirective,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        LabelLinkComponent
    ],
    templateUrl: './contacts-ldap.component.html',
    styleUrl: './contacts-ldap.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsLdapComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription = new Subscription();
    private ContactService: ContactsService = inject(ContactsService);
    protected users: UserByContainer[] = [];
    private router: Router = inject(Router);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    public errors: GenericValidationError = {} as GenericValidationError;

    public post: ContactPost = {} as ContactPost;
    protected containers: SelectKeyValue[] = [];
    protected createAnother: boolean = false;
    protected timeperiods: Timeperiod[] = [];
    protected notificationCommands: SelectKeyValue[] = [];
    private hostPushCommandId: number = 0;
    private servicePushCommandId: number = 0;
    protected hasMacroErrors: boolean = false;

    protected ldapUsers: LdapUser[] = [];
    protected ldapUser: LdapUser | null = null;
    protected ldapConfig: LdapConfig = {} as LdapConfig;

    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    constructor() {
        this.post = this.getDefaultPost();
    }

    public ngOnInit() {
        this.loadContainers();
        this.loadCommands();
        this.loadLdapConfig();
        this.loadLdapUsers('');
    }

    private loadLdapConfig(): void {
        this.subscriptions.add(this.ContactService.ldapConfiguration()
            .subscribe((result) => {
                this.ldapConfig = result.ldapConfig;
                this.cdr.markForCheck();
            }))
    }

    private getDefaultPost(): ContactPost {
        return {
            containers: {_ids: []},
            customvariables: [],
            description: '',
            email: '',
            host_commands: {_ids: []},
            host_notifications_enabled: 1,
            host_push_notifications_enabled: 0,
            host_timeperiod_id: null,
            name: '',
            notify_host_down: 1,
            notify_host_downtime: 0,
            notify_host_flapping: 0,
            notify_host_recovery: 1,
            notify_host_unreachable: 1,
            notify_service_critical: 1,
            notify_service_downtime: 0,
            notify_service_flapping: 0,
            notify_service_recovery: 1,
            notify_service_unknown: 1,
            notify_service_warning: 1,
            phone: '',
            service_commands: {_ids: []},
            service_notifications_enabled: 1,
            service_push_notifications_enabled: 0,
            service_timeperiod_id: null,
            user_id: null,
            uuid: ''
        };
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public submit(): void {
        this.subscriptions.add(this.ContactService.add(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Contact');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['contacts', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (this.createAnother) {
                        this.post = this.getDefaultPost();
                        this.ldapUser = null;
                        return;
                    }
                    // Not sure if HistoryService is a good idea
                    this.router.navigate(['/contacts/index']);
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;

                    this.hasMacroErrors = false;

                    if (this.errors.hasOwnProperty('customvariables')) {
                        if (typeof (this.errors['customvariables']['custom']) === "string") {
                            this.hasMacroErrors = true;
                        }
                    }
                }
            }))
    }

    private loadContainers(): void {
        this.subscriptions.add(this.ContactService.loadContainers()
            .subscribe((result: LoadContainersRoot) => {
                this.containers = result.containers;
                this.cdr.markForCheck();
            }))
    }

    private loadUsers() {
        if (this.post.containers._ids.length === 0) {
            this.users = [];
            this.cdr.markForCheck();
            return;
        }
        const param = {
            containerIds: this.post.containers._ids
        };
        this.subscriptions.add(this.ContactService.loadUsersByContainerId(param)
            .subscribe((result: LoadUsersByContainerIdRoot) => {
                this.users = result.users;
                this.cdr.markForCheck();
            }))
    }

    private loadTimeperiods() {
        if (this.post.containers._ids.length === 0) {
            this.timeperiods = [];
            this.cdr.markForCheck();
            return;
        }
        const param: LoadTimeperiodsPost = {
            container_ids: this.post.containers._ids
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

    public onLdapUserChange(): void {
        this.post.name = this.ldapUser?.givenname as string;
        this.post.description = this.ldapUser?.display_name as string;
        this.post.email = this.ldapUser?.email as string;
        this.cdr.markForCheck();
    }

    public onContainerChange(): void {
        if (this.post.containers._ids.length === 0) {
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

    public loadLdapUsers = (samaccountname: string): void => {
        this.subscriptions.add(this.ContactService.loadLdapUserByString(samaccountname)
            .subscribe((result) => {
                this.ldapUsers = result.ldapUsers;
                this.cdr.markForCheck();
            }));
    }
}
