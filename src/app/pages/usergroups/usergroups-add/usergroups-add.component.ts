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
import { AcoRoot, LoadLdapgroups, UsergroupsAddRoot } from '../usergroups.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HistoryService } from '../../../history.service';
import { UsergroupsService } from '../usergroups.service';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { TrueFalseDirective } from '../../../directives/true-false.directive';


@Component({
    selector: 'oitc-usergroups-add',
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
        TrueFalseDirective
    ],
    templateUrl: './usergroups-add.component.html',
    styleUrl: './usergroups-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsergroupsAddComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly UsergroupsService: UsergroupsService = inject(UsergroupsService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected errors: GenericValidationError | null = null;
    protected acos: AcoRoot = {acos: {}} as AcoRoot;
    protected createAnother: boolean = false;
    protected ldapGroups: SelectKeyValue[] = [];
    protected controllerFilter: string = '';
    protected post: UsergroupsAddRoot = this.getDefaultPost() as UsergroupsAddRoot;
    protected readonly keepOrder = keepOrder;

    public ngOnInit() {
        this.loadAcos();
        this.loadLdapGroups('');
    }

    private loadAcos(): void {
        this.subscriptions.add(this.UsergroupsService.loadAcos().subscribe((acoRoot: AcoRoot) => {
            this.acos = acoRoot;
            this.cdr.markForCheck();
        }));
    }

    protected showController(object: object): boolean {
        return Object.keys(object).length !== 0;
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private getDefaultPost(): UsergroupsAddRoot {
        return {
            Acos: [],
            Usergroup: {
                description: '',
                ldapgroups: {
                    _ids: []
                },
                name: ''
            }
        } as UsergroupsAddRoot;
    }

    protected loadLdapGroups = (search: string = '') => {
        this.subscriptions.add(this.UsergroupsService.loadLdapgroupsForAngular(search).subscribe((ldapgroups: LoadLdapgroups) => {
            this.ldapGroups = ldapgroups.ldapgroups;
            this.cdr.markForCheck();
        }));
    }

    protected addUserrole() {

        this.subscriptions.add(this.UsergroupsService.addUsergroup(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response: { usergroup: GenericIdResponse } = result.data as { usergroup: GenericIdResponse };

                    const title: string = this.TranslocoService.translate('User role');
                    const msg: string = this.TranslocoService.translate('added successfully');
                    const url: (string | number)[] = ['usergroups', 'edit', response.usergroup.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/usergroups/index']);
                        return;
                    }
                    this.post = this.getDefaultPost();
                    this.errors = null;
                    this.loadLdapGroups('');
                    this.notyService.scrollContentDivToTop();

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
