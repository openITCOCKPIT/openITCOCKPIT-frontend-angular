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
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    DropdownComponent,
    DropdownDividerDirective,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { KeyValuePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';

import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { AcoRoot, LoadLdapgroups, UsergroupsEditGetRoot, UsergroupsEditPostRoot } from '../usergroups.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HistoryService } from '../../../history.service';
import { UsergroupsService } from '../usergroups.service';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { TrueFalseDirective } from '../../../directives/true-false.directive';

import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { PermissionsService } from '../../../permissions/permissions.service';

@Component({
    selector: 'oitc-usergroups-edit',
    imports: [
    BackButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FaIconComponent,
    FormCheckInputDirective,
    FormControlDirective,
    FormDirective,
    FormErrorDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    FormsModule,
    MultiSelectComponent,
    NavComponent,
    NavItemComponent,
    NgIf,
    PaginatorModule,
    PermissionDirective,
    RequiredIconComponent,
    TranslocoDirective,
    XsButtonDirective,
    RowComponent,
    ColComponent,
    FormCheckComponent,
    FormCheckLabelDirective,
    TrueFalseDirective,
    RouterLink,
    NgForOf,
    NgClass,
    InputGroupComponent,
    InputGroupTextDirective,
    TranslocoPipe,
    KeyValuePipe,
    DropdownComponent,
    DropdownMenuDirective,
    DropdownToggleDirective,
    DropdownItemDirective,
    DropdownDividerDirective,
    FormLoaderComponent,
    AlertComponent
],
    templateUrl: './usergroups-edit.component.html',
    styleUrl: './usergroups-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsergroupsEditComponent implements OnInit, OnDestroy {

    private readonly subscriptions: Subscription = new Subscription();
    private readonly UsergroupsService: UsergroupsService = inject(UsergroupsService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly PermissionsService = inject(PermissionsService);
    private readonly cdr = inject(ChangeDetectorRef);

    protected systemname: string = 'openITCOCKPIT';
    protected errors: GenericValidationError | null = null;
    protected acos: AcoRoot = {acos: {}} as AcoRoot;
    protected createAnother: boolean = false;
    protected ldapGroups: SelectKeyValue[] = [];
    protected controllerFilter: string = '';
    protected readonly keepOrder = keepOrder;
    protected post: UsergroupsEditPostRoot = {
        Acos: {},
        Usergroup: {
            acos: {},
            created: '',
            description: '',
            id: 0,
            ldapgroups: {
                _ids: [],
            },
            modified: '',
            name: '',
            aro: {}
        }
    } as unknown as UsergroupsEditPostRoot;

    public ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));

        this.subscriptions.add(this.UsergroupsService.loadAcos().subscribe((acoRoot: AcoRoot) => {
            this.acos = acoRoot;
            this.cdr.markForCheck();
        }));

        this.subscriptions.add(this.UsergroupsService.getEdit(id).subscribe((result: UsergroupsEditGetRoot) => {
            this.cdr.markForCheck();
            this.post.Usergroup = result.usergroup;
            this.post.Acos = result.acos;
            this.systemname = result.systemname;


            //Set permissions of current user group to $scope.post.Acos;
            if ((result.usergroup.aro) && result.usergroup.aro.acos) {
                for (let usergroupAco in result.usergroup.aro.acos) {
                    let usergroupAcoId = result.usergroup.aro.acos[parseInt(usergroupAco)].id;

                    //Deny all by default
                    this.post.Acos[usergroupAcoId] = 0;

                    if (result.usergroup.aro.acos[parseInt(usergroupAco)]._joinData._create === "1") {
                        //Only enable what is enabled in the database
                        this.post.Acos[usergroupAcoId] = 1;
                    }
                }
            }
        }));

        // Load current detaails

        this.loadLdapGroups('');
    }

    protected showController(object: object): boolean {
        return Object.keys(object).length !== 0;
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    protected loadLdapGroups(search: string = ''): void {
        this.subscriptions.add(this.UsergroupsService.loadLdapgroupsForAngular(search).subscribe((ldapgroups: LoadLdapgroups) => {
            this.ldapGroups = ldapgroups.ldapgroups;
            this.cdr.markForCheck();
        }));
    }

    protected editUserrole() {
        this.subscriptions.add(this.UsergroupsService.updateUsergroup(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response: GenericIdResponse = result.data as GenericIdResponse;

                    const title: string = this.TranslocoService.translate('User role');
                    const msg: string = this.TranslocoService.translate('updated successfully');
                    const url: (string | number)[] = ['usergroups', 'edit', result.data.usergroup.id];

                    // Reload user permissions just in the current logged in is part of the user group
                    this.PermissionsService.loadPermissions();

                    this.notyService.genericSuccess(msg, title, url);

                    this.HistoryService.navigateWithFallback(['/usergroups/index']);

                    return;
                }

                // Error
                this.notyService.genericError();
                const errorResponse: GenericValidationError = result.data as GenericValidationError;
                if (result) {
                    this.errors = errorResponse;

                    // This is a bit of a hack, but it's the only way to get the error message to show up in the right place.
                    if (typeof this.errors['container']['name'] !== 'undefined') {
                        this.errors['name'] = <any>this.errors['container']['name'];
                    }
                }
            })
        );
    }

    protected forceTicks(actionToTick: string, tick: boolean) {
        for (let aco in this.acos.acos) {
            for (let controller in this.acos.acos[aco].children) {
                let isModule = this.acos.acos[aco].children[controller].alias.substr(-6) === 'Module';

                if (isModule) {
                    for (let pluginController in this.acos.acos[aco].children[controller].children) {
                        for (let action in this.acos.acos[aco].children[controller].children[pluginController].children) {
                            let actionName = this.acos.acos[aco].children[controller].children[pluginController].children[action].alias;
                            let acoId = this.acos.acos[aco].children[controller].children[pluginController].children[action].id;
                            if (actionName === actionToTick || actionToTick === 'all') {
                                this.post.Acos[acoId] = tick ? 1 : 0;
                            }
                        }
                    }
                    continue;
                }
                for (let action in this.acos.acos[aco].children[controller].children) {
                    let acoId = this.acos.acos[aco].children[controller].children[action].id;
                    let actionName = this.acos.acos[aco].children[controller].children[action].alias;
                    if (actionName === actionToTick || actionToTick === 'all') {
                        this.post.Acos[acoId] = tick ? 1 : 0;
                    }
                }
            }
        }
        this.cdr.markForCheck();
    };
}

const keepOrder = (a: any, b: any) => a;

// This pipe uses the angular keyvalue pipe. but doesn't change order.
@Pipe({
    standalone: true,
    name: 'defaultOrderKeyvalue'
})
export class DefaultOrderKeyValuePipe extends KeyValuePipe implements PipeTransform {
    override transform(value: any, ...args: any[]): any {
        return super.transform(value, keepOrder);
    }
}
