import { Component, inject, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective, ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent, RowComponent
} from '@coreui/angular';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import {
    LoadContainerPermissionsRequest,
    LoadContainerPermissionsRoot,
    LoadContainerRolesRequest,
    LoadContainerRolesRoot,
    UserDateformat,
    UserDateformatsRoot,
    UserLocaleOption,
    UsersAddRoot,
    UserTimezonesSelect
} from '../users.interface';
import { UsersService } from '../users.service';
import { Subscription } from 'rxjs';
import { ContainersService } from '../../containers/containers.service';
import { ContainersLoadContainersByStringParams } from '../../containers/containers.interface';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { GenericValidationError } from '../../../generic-responses';
import { KeyValuePipe, NgForOf, NgIf } from '@angular/common';

@Component({
    selector: 'oitc-users-add',
    standalone: true,
    imports: [
        CoreuiComponent,
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        CardComponent,
        CardHeaderComponent,
        BackButtonDirective,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        CardBodyComponent,
        CardFooterComponent,
        FormCheckInputDirective,
        ReactiveFormsModule,
        FormsModule,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        MultiSelectComponent,
        RequiredIconComponent,
        SelectComponent,
        FormCheckComponent,
        FormCheckLabelDirective,
        TrueFalseDirective,
        FormControlDirective,
        RowComponent,
        ColComponent,
        NgIf,
        NgForOf,
        KeyValuePipe,
        BadgeComponent
    ],
    templateUrl: './users-add.component.html',
    styleUrl: './users-add.component.css'
})
export class UsersAddComponent implements OnDestroy, OnInit, OnChanges {
    private readonly UsersService: UsersService = inject(UsersService);
    private readonly ContainersService: ContainersService = inject(ContainersService);
    private readonly subscriptions: Subscription = new Subscription();

    protected createAnother: boolean = false;
    protected post: UsersAddRoot = {
        User: {
            apikeys: [],
            company: '',
            confirm_password: '',
            ContainersUsersMemberships: {},
            dashboard_tab_rotation: 25,
            dateformat: '',
            email: '',
            firstname: '',
            i18n: '',
            is_active: 1,
            is_oauth: 0,
            lastname: '',
            paginatorlength: 25,
            password: '',
            phone: '',
            position: '',
            recursive_browser: 0,
            showstatsinmenu: 0,
            timezone: '',
            usercontainerroles: {
                _ids: []
            },
            usergroup_id: 0
        },
    };
    protected containerRoles: LoadContainerRolesRoot = {} as LoadContainerRolesRoot;
    protected selectedContainerIds: number[] = [];
    protected containers: SelectKeyValue[] = [];
    protected dateformats: UserDateformat[] = [];
    protected timezones: UserTimezonesSelect[] = [];
    protected localeOptions: UserLocaleOption[] = [];
    protected errors: GenericValidationError | null = null;
    protected containerPermissions: LoadContainerPermissionsRoot = {} as LoadContainerPermissionsRoot;

    public ngOnChanges() {
        console.log(this.selectedContainerIds);
    }

    public ngOnInit() {
        this.loadContainers();
        this.loadDateformats();
        this.loadLocaleOptions();
        this.loadContainerRoles('');
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadContainerRoles = (query: string): void => {
        let params: LoadContainerRolesRequest = {
            'filter[Usercontainerroles.name]': query,
            selected: this.post.User.usercontainerroles._ids,
            angular: true
        }
        this.subscriptions.add(this.UsersService.loadContainerRoles(params)
            .subscribe((result: LoadContainerRolesRoot) => {
                this.containerRoles = result;
            }));
    }

    protected onContainerSelectChange = (event: any): void => {
        this.loadContainerPermissions();
    }

    protected loadContainerPermissions = (): void => {
        let params: LoadContainerPermissionsRequest = {
            'usercontainerRoleIds[]': this.post.User.usercontainerroles._ids,
            angular: true
        }
        this.subscriptions.add(this.UsersService.loadContainerPermissions(params)
            .subscribe((result: LoadContainerPermissionsRoot) => {
                this.containerPermissions = result;
            }));
    }
    public loadContainers = (): void => {
        this.subscriptions.add(this.ContainersService.loadContainersByString({} as ContainersLoadContainersByStringParams)
            .subscribe((result: SelectKeyValue[]) => {
                this.containers = result;
            }));
    }

    public loadDateformats = (): void => {
        this.subscriptions.add(this.UsersService.getDateformats()
            .subscribe((result: UserDateformatsRoot) => {
                this.dateformats = result.dateformats;
                this.timezones = result.timezones;
            }));
    }

    public loadLocaleOptions = (): void => {
        this.subscriptions.add(this.UsersService.getLocaleOptions()
            .subscribe((result: UserLocaleOption[]) => {
                this.localeOptions = result;
            }));
    }

}
