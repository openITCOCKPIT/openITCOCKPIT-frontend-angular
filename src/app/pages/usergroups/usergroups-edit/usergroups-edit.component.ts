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
import { KeyValuePipe, NgClass } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';

import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { AcoRoot, LoadLdapgroups, UsergroupsEditPostRoot } from '../usergroups.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HistoryService } from '../../../history.service';
import { UsergroupsService } from '../usergroups.service';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';

import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { PermissionsService } from '../../../permissions/permissions.service';
import { TrueFalseDirective } from '../../../directives/true-false.directive';

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
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        PaginatorModule,
        PermissionDirective,
        RequiredIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        RowComponent,
        ColComponent,
        RouterLink,
        InputGroupComponent,
        InputGroupTextDirective,
        TranslocoPipe,
        DropdownComponent,
        DropdownMenuDirective,
        DropdownToggleDirective,
        DropdownItemDirective,
        DropdownDividerDirective,
        FormLoaderComponent,
        AlertComponent,
        NgClass,
        TrueFalseDirective,
        FormCheckComponent,
        KeyValuePipe,
        FormCheckLabelDirective,
        FormCheckInputDirective
    ],
    templateUrl: './usergroups-edit.component.html',
    styleUrl: './usergroups-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsergroupsEditComponent implements OnInit, OnDestroy {

    private readonly subscriptions: Subscription = new Subscription();
    private readonly UsergroupsService: UsergroupsService = inject(UsergroupsService);
    private readonly notyService: NotyService = inject(NotyService);
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
    protected post!: UsergroupsEditPostRoot;

    public ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));

        this.subscriptions.add(this.UsergroupsService.loadAcos().subscribe((acoRoot: AcoRoot) => {
            this.acos = acoRoot;
            this.cdr.markForCheck();
        }));

        this.subscriptions.add(this.UsergroupsService.getEdit(id).subscribe((response) => {
            this.cdr.markForCheck();

            this.post = {
                Usergroup: response.usergroup,
                Acos: response.acos
            };


            this.systemname = response.systemname;


            //Set permissions of current user group to $scope.post.Acos;
            if ((response.usergroup.aro) && response.usergroup.aro.acos) {
                for (let usergroupAco in response.usergroup.aro.acos) {
                    let usergroupAcoId = response.usergroup.aro.acos[parseInt(usergroupAco)].id;

                    //Deny all by default
                    this.post.Acos[usergroupAcoId] = 0;

                    if (response.usergroup.aro.acos[parseInt(usergroupAco)]._joinData._create === "1") {
                        //Only enable what is enabled in the database
                        this.post.Acos[usergroupAcoId] = 1;
                    }
                }
            }
            this.loadLdapGroups('');
        }));

        // Load current detaails


    }

    protected showController(object: object): boolean {
        return Object.keys(object).length !== 0;
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    protected loadLdapGroups = (search: string = '') => {
        let selected: number[] = [];
        if (this.post.Usergroup.ldapgroups && this.post.Usergroup.ldapgroups._ids) {
            selected = this.post.Usergroup.ldapgroups._ids;
        }
        this.subscriptions.add(this.UsergroupsService.loadLdapgroupsForAngular(search, selected).subscribe((ldapgroups: LoadLdapgroups) => {
            this.ldapGroups = ldapgroups.ldapgroups;
            this.cdr.markForCheck();
        }));
    }

    protected editUserrole() {
        this.subscriptions.add(this.UsergroupsService.updateUsergroup(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
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
                }
            })
        );
    }

    protected forceTicks(actionToTick: string, tick: boolean) {
        for (let aco in this.acos.acos) {
            for (let controller in this.acos.acos[aco].children) {
                let isModule = this.acos.acos[aco].children[controller].alias.endsWith('Module');

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
