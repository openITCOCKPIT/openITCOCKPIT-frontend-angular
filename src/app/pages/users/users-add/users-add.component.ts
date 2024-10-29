import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnDestroy,
    OnInit,
    Pipe,
    PipeTransform
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TextColorDirective
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
    LoadUsergroupsRoot,
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
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { HistoryService } from '../../../history.service';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ProfileService } from '../../profile/profile.service';
import { NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';

@Component({
    selector: 'oitc-users-add',
    standalone: true,
    imports: [
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
        BadgeComponent,
        FormDirective,
        InputGroupComponent,
        TextColorDirective,
        NgOptionTemplateDirective,
        NgSelectComponent,
        NgOptionHighlightDirective
    ],
    templateUrl: './users-add.component.html',
    styleUrl: './users-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersAddComponent implements OnDestroy, OnInit {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly UsersService: UsersService = inject(UsersService);
    private readonly ContainersService: ContainersService = inject(ContainersService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly profileService: ProfileService = inject(ProfileService);

    protected readonly keepOrder = keepOrder;
    protected createAnother: boolean = false;
    protected post: UsersAddRoot = this.getDefaultPost();
    protected containerRoles: LoadContainerRolesRoot = {} as LoadContainerRolesRoot;
    protected selectedContainerIds: number[] = [];
    protected containers: SelectKeyValue[] = [];
    protected dateformats: UserDateformat[] = [];
    protected timezones: UserTimezonesSelect[] = [];
    protected localeOptions: UserLocaleOption[] = [];
    protected usergroups: SelectKeyValue[] = [];
    protected errors: GenericValidationError = {} as GenericValidationError;
    protected containerPermissions: LoadContainerPermissionsRoot = {} as LoadContainerPermissionsRoot;
    protected tabRotationIntervalText: string = '';
    protected serverTime: string = '';
    protected serverTimeZone: string = '';
    private cdr = inject(ChangeDetectorRef);

    public onSelectedContainerIdsChange() {
        // Traverse all containerids and set the value to 1.
        this.selectedContainerIds.map((id) => {
            if (id === 1) {
                this.post.User.ContainersUsersMemberships[id] = 2;
                return;
            }
            // Only if not already set to 1 or 2.
            if (this.post.User.ContainersUsersMemberships[id] !== 2) {
                this.post.User.ContainersUsersMemberships[id] = 1;
            }
        });
        this.cdr.markForCheck();
    }

    public addUser(): void {
        this.subscriptions.add(this.UsersService.addUser(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    this.cdr.markForCheck();

                    const title: string = this.TranslocoService.translate('User');
                    const msg: string = this.TranslocoService.translate('added successfully');
                    const url: (string | number)[] = ['users', 'edit', result.data.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/users/index']);
                        return;
                    }
                    this.post = this.getDefaultPost();
                    this.errors = {} as GenericValidationError;
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();

                    return;
                }

                // Error
                this.notyService.genericError();
                const errorResponse: GenericValidationError = result.data as GenericValidationError;
                if (result) {
                    this.errors = errorResponse;

                    console.warn(this.errors);
                }
            })
        );
    }

    private getDefaultPost(): UsersAddRoot {
        return {
            User: {
// USER FIELDS
                apikeys: [],
                company: '',
                confirm_password: '',
                ContainersUsersMemberships: {},
                dashboard_tab_rotation: 0,
                dateformat: 'H:i:s - d.m.Y',
                email: '',
                firstname: '',
                i18n: 'en_US',
                is_active: 1,
                is_oauth: 0,
                lastname: '',
                paginatorlength: 25,
                password: '',
                phone: '',
                position: '',
                recursive_browser: 0,
                showstatsinmenu: 0,
                timezone: 'Europe/Berlin',
                usercontainerroles: {
                    _ids: []
                },
                usergroup_id: 0,
            },
        };
    }

    public ngOnInit() {
        this.selectedContainerIds = [];
        this.containerPermissions = {} as LoadContainerPermissionsRoot;
        this.containerRoles = {} as LoadContainerRolesRoot;

        this.updateTabRotationInterval();
        this.loadContainers();
        this.loadDateformats();
        this.loadLocaleOptions();
        this.loadContainerRoles('');
        this.loadUsergroups();
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
                this.cdr.markForCheck();
            }));
    }

    protected onContainerSelectChange = (event: any): void => {
        this.loadContainerPermissions();
    }

    protected loadContainerPermissions = (): void => {
        // For each containerPermissions object attach the containerId to this.containerRoleContainerIds.
        this.containerPermissions = {} as LoadContainerPermissionsRoot;

        if (this.post.User.usercontainerroles._ids.length === 0) {
            this.cdr.markForCheck();
            return;
        }
        let params: LoadContainerPermissionsRequest = {
            'usercontainerRoleIds[]': this.post.User.usercontainerroles._ids,
            angular: true
        }
        this.subscriptions.add(this.UsersService.loadContainerPermissions(params)
            .subscribe((result: LoadContainerPermissionsRoot) => {
                this.containerPermissions = result;
                this.cdr.markForCheck();
            }));
    }

    public loadContainers = (): void => {
        this.subscriptions.add(this.ContainersService.loadContainersByString({} as ContainersLoadContainersByStringParams)
            .subscribe((result: SelectKeyValue[]) => {
                this.containers = result;
                this.cdr.markForCheck();
            }));
    }

    public loadDateformats = (): void => {
        this.subscriptions.add(this.UsersService.getDateformats()
            .subscribe((result: UserDateformatsRoot) => {
                this.dateformats = result.dateformats;
                this.timezones = result.timezones;

                this.serverTimeZone = result.serverTimeZone;
                this.serverTime = result.serverTime;
                this.cdr.markForCheck();
            }));
    }

    public loadLocaleOptions = (): void => {
        this.subscriptions.add(this.UsersService.getLocaleOptions()
            .subscribe((result: UserLocaleOption[]) => {
                this.localeOptions = result;
                this.cdr.markForCheck();
            }));
    }

    private loadUsergroups(): void {
        this.subscriptions.add(this.UsersService.getUsergroups()
            .subscribe((result: LoadUsergroupsRoot) => {
                this.usergroups = result.usergroups;
                this.cdr.markForCheck();
            }))
    }

    protected createApiKey(): void {
        this.subscriptions.add(this.profileService.generateNewApiKey()
            .subscribe((result) => {
                this.post.User.apikeys.push(result);
                this.cdr.markForCheck();
            })
        );
    }

    protected updateTabRotationInterval(): void {
        this.cdr.markForCheck();
        if (this.post.User.dashboard_tab_rotation === 0) {
            this.tabRotationIntervalText = 'disabled';
            return;
        }
        let min = Math.floor(this.post.User.dashboard_tab_rotation / 60),
            sec = Math.round(this.post.User.dashboard_tab_rotation % 60);
        if (min > 0) {
            this.tabRotationIntervalText = min + ' minutes, ' + sec + ' seconds';
            return;
        }
        this.tabRotationIntervalText = sec + ' seconds';
    }

    protected deleteApiKey(index: number): void {
        this.post.User.apikeys.splice(index, 1);
        this.cdr.markForCheck();
    }

    protected refreshApiKey(index: number): void {
        this.subscriptions.add(this.profileService.generateNewApiKey()
            .subscribe((result) => {
                this.post.User.apikeys[index].apikey = result.apikey;
                this.cdr.markForCheck();
            })
        );
    }

    protected trackByIndex(index: number, item: any): number {
        return index;
    }
}

const keepOrder = (a: any, b: any) => a;

// This pipe uses the angular keyvalue pipe. but doesn't change order.
@Pipe({
    standalone: true,
    name: 'sortKeyValue'
})
export class SortKeyValuePipe extends KeyValuePipe implements PipeTransform {

    override transform(value: any, ...args: any[]): any {
        return super.transform(value, keepOrder);
    }

}
