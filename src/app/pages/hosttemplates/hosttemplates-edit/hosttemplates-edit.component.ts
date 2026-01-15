import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    AlertComponent,
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
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HosttemplateTypesEnum } from '../hosttemplate-types.enum';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { HosttemplateContainerResult, HosttemplatePost, HosttemplateTypeResult, } from '../hosttemplates.interface';
import { Subscription } from 'rxjs';
import { HosttemplatesService } from '../hosttemplates.service';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { NgSelectModule } from '@ng-select/ng-select';
import { PriorityComponent } from '../../../layouts/coreui/priority/priority.component';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { IntervalInputComponent } from '../../../layouts/coreui/interval-input/interval-input.component';
import {
    CheckAttemptsInputComponent
} from '../../../layouts/coreui/check-attempts-input/check-attempts-input.component';
import { HumanTimeComponent } from '../../../layouts/coreui/interval-input/human-time/human-time.component';
import { MacrosComponent } from '../../../components/macros/macros.component';
import { ObjectTypesEnum } from '../../changelogs/object-types.enum';
import { PermissionsService } from '../../../permissions/permissions.service';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ObjectUuidComponent } from '../../../layouts/coreui/object-uuid/object-uuid.component';
import { HostOrServiceType } from '../../hosts/hosts.interface';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-hosttemplates-edit',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        RequiredIconComponent,
        NgClass,
        MultiSelectComponent,
        SelectComponent,
        NgSelectModule,
        PriorityComponent,
        LabelLinkComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        TrueFalseDirective,
        IntervalInputComponent,
        AlertComponent,
        CheckAttemptsInputComponent,
        HumanTimeComponent,
        MacrosComponent,
        CardFooterComponent,
        ObjectUuidComponent,
        FormLoaderComponent,
        TranslocoPipe,
        AsyncPipe
    ],
    templateUrl: './hosttemplates-edit.component.html',
    styleUrl: './hosttemplates-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HosttemplatesEditComponent implements OnInit, OnDestroy {

    public hosttemplateTypes: HosttemplateTypeResult[] = [];
    public containers: HosttemplateContainerResult | undefined;
    public commands: SelectKeyValue[] = [];
    public tagsForSelect: string[] = [];
    public post!: HosttemplatePost;
    public typeDetails: HostOrServiceType | undefined;

    public timeperiods: SelectKeyValue[] = [];
    public checkperiods: SelectKeyValue[] = [];
    public contacts: SelectKeyValue[] = [];
    public contactgroups: SelectKeyValue[] = [];
    public hostgroups: SelectKeyValue[] = [];
    public exporters: SelectKeyValue[] = [];
    public slas: SelectKeyValue[] = [];

    public errors: GenericValidationError | null = null;
    public hasMacroErrors: boolean = false;

    private hosttemplateTypeId = HosttemplateTypesEnum.GENERIC_HOSTTEMPLATE;
    private readonly HosttemplatesService = inject(HosttemplatesService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private router: Router = inject(Router);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    constructor(private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.subscriptions.add(this.HosttemplatesService.getEdit(id)
            .subscribe((result) => {
                this.post = result.hosttemplate.Hosttemplate;
                this.hosttemplateTypes = result.types;
                this.commands = result.commands;

                if (this.post.tags) {
                    this.tagsForSelect = this.post.tags.split(',');
                }

                this.setDetailsForType();

                this.loadContainers(id);
                this.loadElements();
            }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadContainers(hosttemplateId: number) {
        this.subscriptions.add(this.HosttemplatesService.loadContainers(hosttemplateId)
            .subscribe((result) => {
                this.containers = result;
                this.cdr.markForCheck();
            })
        );
    }

    private setDetailsForType() {
        this.typeDetails = this.hosttemplateTypes.find(type => type.key === this.post.hosttemplatetype_id)?.value;
        this.cdr.markForCheck();
    };

    private loadElements() {
        const containerId = this.post.container_id;

        if (!containerId) {
            return;
        }

        this.subscriptions.add(this.HosttemplatesService.loadElements(containerId)
            .subscribe((result) => {
                this.timeperiods = result.timeperiods;
                this.checkperiods = result.checkperiods;
                this.contacts = result.contacts;
                this.contactgroups = result.contactgroups;
                this.hostgroups = result.hostgroups;
                this.exporters = result.exporters;
                this.slas = result.slas;
                this.cdr.markForCheck();
            })
        );

    }

    private loadCommandArguments() {
        const commandId = this.post.command_id;
        const hosttemplateId = this.post.id;

        if (!commandId || !hosttemplateId) {
            return;
        }

        this.subscriptions.add(this.HosttemplatesService.loadCommandArgumentsForEdit(commandId, hosttemplateId)
            .subscribe((result) => {
                this.post.hosttemplatecommandargumentvalues = result;
                this.cdr.markForCheck();
            })
        );

    }

    public onContainerChange() {
        this.loadElements();
    }

    public onTypeChange() {
        this.setDetailsForType();
    }

    public onCommandChange() {
        this.loadCommandArguments();
    }

    /*******************
     * MACRO functions *
     *******************/
    public addMacro() {
        this.post.customvariables.push({
            name: '',
            objecttype_id: ObjectTypesEnum["HOSTTEMPLATE"],
            password: 0,
            value: '',
        });
        this.cdr.markForCheck();
    }

    protected deleteMacro = (index: number) => {
        this.post.customvariables.splice(index, 1);
        this.cdr.markForCheck();
    }


    public submit() {
        this.post.tags = this.tagsForSelect.join(',');


        this.subscriptions.add(this.HosttemplatesService.edit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Host template');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['hosttemplates', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);


                    this.HistoryService.navigateWithFallback(['/hosttemplates/index']);
                    this.notyService.scrollContentDivToTop();
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
            }));

    }
}
