import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
    AlertComponent,
    AlertHeadingDirective,
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
    BadgeComponent,
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
import { ContainersService } from '../../containers/containers.service';
import { ContactsService } from '../contacts.service';
import { UsersService } from '../../users/users.service';
import {
    ContactPost,
    LoadCommand,
    LoadCommandsRoot,
    LoadTimeperiodsPost,
    LoadTimeperiodsRoot,
    Timeperiod
} from '../contacts.interface';
import { LoadUsersByContainerIdRoot, UserByContainer } from '../../users/users.interface';
import { Container } from '../../containers/containers.interface';

@Component({
    selector: 'oitc-contacts-add',
    standalone: true,
    imports: [
        CoreuiComponent,
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        FormDirective,
        FormsModule,
        CardComponent,
        BackButtonDirective,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        CardBodyComponent,
        AlertComponent,
        AlertHeadingDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormSelectDirective,
        FormControlDirective,
        RequiredIconComponent,
        BadgeComponent,
        FormCheckInputDirective,
        NgForOf,
        NgSelectModule,
        FormCheckComponent,
        NgIf,
        TranslocoPipe,
        MacrosComponent,
        CardFooterComponent,
        FormCheckLabelDirective,
        TooltipDirective
    ],
    templateUrl: './contacts-add.component.html',
    styleUrl: './contacts-add.component.css'
})
export class ContactsAddComponent implements OnInit, OnDestroy {
    private containersService: ContainersService = inject(ContainersService);
    private subscriptions: Subscription = new Subscription();
    private ContactService: ContactsService = inject(ContactsService);
    protected users: UserByContainer[] = [];
    private UsersService: UsersService = inject(UsersService);
    private router: Router = inject(Router);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    public errors: GenericValidationError = {} as GenericValidationError;

    public post: ContactPost = {} as ContactPost;
    protected containers: Container[] = [];
    protected createAnother: boolean = false;
    protected timeperiods: Timeperiod[] = [];
    protected notificationCommands: LoadCommand[] = [];
    private hostPushCommandId: number = 0;
    private servicePushCommandId: number = 0;

    constructor() {
        this.post = this.getDefaultPost();
    }

    public ngOnInit() {
        this.loadContainers();
        this.loadCommands();
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
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Contact');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['contacts', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (this.createAnother) {
                        this.post = this.getDefaultPost();
                        return;
                    }
                    this.router.navigate(['/contacts/index']);
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            }))
    }

    private loadContainers(): void {
        this.subscriptions.add(this.containersService.loadContainers()
            .subscribe((result) => {
                this.containers = result.containers;
            }))
    }

    private loadUsers() {
        if (this.post.containers._ids.length === 0) {
            this.users = [];
            return;
        }
        const param = {
            containerIds: this.post.containers._ids
        };
        this.subscriptions.add(this.UsersService.loadUsersByContainerId(param)
            .subscribe((result: LoadUsersByContainerIdRoot) => {
                this.users = result.users;
            }))
    }

    private loadTimeperiods() {
        if (this.post.containers._ids.length === 0) {
            this.timeperiods = [];
            return;
        }
        const param: LoadTimeperiodsPost = {
            container_ids: this.post.containers._ids
        };
        this.subscriptions.add(this.ContactService.loadTimeperiods(param).subscribe((result: LoadTimeperiodsRoot) => {
            this.timeperiods = result.timeperiods;
        }));
    }

    private loadCommands() {
        this.subscriptions.add(this.ContactService.loadCommands().subscribe((result: LoadCommandsRoot) => {
            this.notificationCommands = result.notificationCommands;
            this.hostPushCommandId = result.hostPushComamndId;
            this.servicePushCommandId = result.servicePushComamndId;
        }));
    }

    public onContainerChange(): void {
        if (this.post.containers._ids.length === 0) {
            this.users = [];
            this.timeperiods = [];
            return;
        }
        this.loadUsers();
        this.loadTimeperiods();
    }

    public addMacro() {
        this.post.customvariables.push({
            name: '',
            objecttype_id: 32,
            password: 0,
            value: '',
        });
    }

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

    protected updateServiceBrowserNotification(): void {
        if (this.post.service_commands._ids.indexOf(this.servicePushCommandId) !== -1) {
            this.post.service_push_notifications_enabled = 1;
        } else {
            this.post.service_push_notifications_enabled = 0;
        }
    }

    protected updateHostBrowserNotification(): void {
        if (this.post.host_commands._ids.indexOf(this.hostPushCommandId) !== -1) {
            this.post.host_push_notifications_enabled = 1;
        } else {
            this.post.host_push_notifications_enabled = 0;
        }
    }

    /*******************
     * ARROW functions *
     *******************/
    protected deleteMacro = (index: number) => {
        this.post.customvariables.splice(index, 1);
    }
}
