import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CheckAttemptsInputComponent
} from '../../../layouts/coreui/check-attempts-input/check-attempts-input.component';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { HumanTimeComponent } from '../../../layouts/coreui/interval-input/human-time/human-time.component';
import { IntervalInputComponent } from '../../../layouts/coreui/interval-input/interval-input.component';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { MacrosComponent } from '../../../components/macros/macros.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginatorModule } from 'primeng/paginator';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { PriorityComponent } from '../../../layouts/coreui/priority/priority.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {
    ServicetemplateContainerResult,
    ServicetemplatePost,
    ServicetemplateTypeResult,
} from '../servicetemplates.interface';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { ServicetemplateTypesEnum } from '../servicetemplate-types.enum';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ObjectTypesEnum } from '../../changelogs/object-types.enum';
import { ServicetemplatesService } from '../servicetemplates.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { ObjectUuidComponent } from '../../../layouts/coreui/object-uuid/object-uuid.component';
import { HostOrServiceType } from '../../hosts/hosts.interface';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { HistoryService } from '../../../history.service';


@Component({
    selector: 'oitc-servicetemplates-edit',
    imports: [
    AlertComponent,
    BackButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    CheckAttemptsInputComponent,
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
    HumanTimeComponent,
    IntervalInputComponent,
    LabelLinkComponent,
    MacrosComponent,
    MultiSelectComponent,
    NavComponent,
    NavItemComponent,
    NgSelectModule,
    PaginatorModule,
    PermissionDirective,
    PriorityComponent,
    RequiredIconComponent,
    SelectComponent,
    TranslocoDirective,
    TrueFalseDirective,
    XsButtonDirective,
    RouterLink,
    NgClass,
    ObjectUuidComponent,
    FormLoaderComponent,
    TranslocoPipe,
    AsyncPipe
],
    templateUrl: './servicetemplates-edit.component.html',
    styleUrl: './servicetemplates-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicetemplatesEditComponent implements OnInit, OnDestroy {
    public servicetemplateTypes: ServicetemplateTypeResult[] = [];
    public containers: ServicetemplateContainerResult | undefined;
    public commands: SelectKeyValue[] = [];
    public eventhandlerCommands: SelectKeyValue[] = [];
    public tagsForSelect: string[] = [];
    public post!: ServicetemplatePost;
    public typeDetails: HostOrServiceType | undefined;

    public timeperiods: SelectKeyValue[] = [];
    public checkperiods: SelectKeyValue[] = [];
    public contacts: SelectKeyValue[] = [];
    public contactgroups: SelectKeyValue[] = [];
    public servicegroups: SelectKeyValue[] = [];

    public errors: GenericValidationError | null = null;
    public hasMacroErrors: boolean = false;

    public createAnother: boolean = false;

    private servicetemplateTypeId = ServicetemplateTypesEnum.GENERIC_SERVICE;
    private readonly ServicetemplatesService = inject(ServicetemplatesService);
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
        this.subscriptions.add(this.ServicetemplatesService.getEdit(id)
            .subscribe((result) => {
                this.post = result.servicetemplate.Servicetemplate;
                this.servicetemplateTypes = result.types;
                this.commands = result.commands;
                this.eventhandlerCommands = result.eventhandlerCommands;

                if (this.post.tags) {
                    this.tagsForSelect = this.post.tags.split(',');
                }

                this.setDetailsForType();

                this.loadContainers(id);
                this.loadElements();
                this.cdr.markForCheck();
            }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }


    public loadContainers(servicetemplateId: number) {
        this.subscriptions.add(this.ServicetemplatesService.loadContainers(servicetemplateId)
            .subscribe((result) => {
                this.containers = result;
                this.cdr.markForCheck();
            })
        );
    }

    private setDetailsForType() {
        this.typeDetails = this.servicetemplateTypes.find(type => type.key === this.post.servicetemplatetype_id)?.value;
        this.cdr.markForCheck();
    };

    private loadElements() {
        const containerId = this.post.container_id;

        if (!containerId) {
            return;
        }

        this.subscriptions.add(this.ServicetemplatesService.loadElements(containerId)
            .subscribe((result) => {
                this.cdr.markForCheck();
                this.timeperiods = result.timeperiods;
                this.checkperiods = result.checkperiods;
                this.contacts = result.contacts;
                this.contactgroups = result.contactgroups;
                this.servicegroups = result.servicegroups;
            })
        );

    }

    private loadCommandArguments() {
        const commandId = this.post.command_id;
        const servicetemplateId = this.post.id;


        if (!commandId || !servicetemplateId) {
            return;
        }

        this.subscriptions.add(this.ServicetemplatesService.loadCommandArguments(commandId, servicetemplateId)
            .subscribe((result) => {
                this.post.servicetemplatecommandargumentvalues = result;
                this.cdr.markForCheck();
            })
        );

    }

    private loadEventHandlerCommandArguments() {
        const eventHandlerCommandId = this.post.eventhandler_command_id;
        const servicetemplateId = this.post.id;

        if (!eventHandlerCommandId || !servicetemplateId) {
            //"None" selected
            this.cdr.markForCheck();
            this.post.servicetemplateeventcommandargumentvalues = [];
            return;
        }

        this.subscriptions.add(this.ServicetemplatesService.loadEventHandlerCommandArguments(eventHandlerCommandId, servicetemplateId)
            .subscribe((result) => {
                this.post.servicetemplateeventcommandargumentvalues = result;
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

    public onEventHandlerChange() {
        this.loadEventHandlerCommandArguments();
    }

    /*******************
     * MACRO functions *
     *******************/
    public addMacro() {
        this.post.customvariables.push({
            name: '',
            objecttype_id: ObjectTypesEnum["SERVICETEMPLATE"],
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


        this.subscriptions.add(this.ServicetemplatesService.edit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Service template');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['servicetemplates', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    this.HistoryService.navigateWithFallback(['/servicetemplates/index']);

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
