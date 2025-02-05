import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GenericValidationError } from '../../../../../generic-responses';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ImportedhostsService } from '../importedhosts.service';
import { HistoryService } from '../../../../../history.service';
import { ImportedHostPost } from '../importedhosts.interface';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TooltipDirective
} from '@coreui/angular';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ImportedHostFlagsEnum } from '../imported-hosts.enum';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { ROOT_CONTAINER } from '../../../../../pages/changelogs/object-types.enum';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { LabelLinkComponent } from '../../../../../layouts/coreui/label-link/label-link.component';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import {
    RegexHelperTooltipComponent
} from '../../../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';

@Component({
    selector: 'oitc-imported-hosts-edit',
    imports: [
        FaIconComponent,
        TranslocoDirective,
        RouterLink,
        PermissionDirective,
        FormLoaderComponent,
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FormDirective,
        BadgeComponent,
        AsyncPipe,
        TooltipDirective,
        TranslocoPipe,
        BackButtonDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        CardBodyComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        RequiredIconComponent,
        SelectComponent,
        MultiSelectComponent,
        LabelLinkComponent,
        RowComponent,
        ColComponent,
        DebounceDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        RegexHelperTooltipComponent,
        CardFooterComponent
    ],
    templateUrl: './imported-hosts-edit.component.html',
    styleUrl: './imported-hosts-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportedHostsEditComponent implements OnInit, OnDestroy {

    public post!: ImportedHostPost;
    public errors: GenericValidationError | null = null;

    public containers: SelectKeyValue[] = [];
    public hosttemplates: SelectKeyValue[] = [];
    public servicetemplates: SelectKeyValue[] = [];
    public sharingContainers: SelectKeyValue[] = [];
    public servicetemplategroups: SelectKeyValue[] = [];
    public satellites: SelectKeyValue[] = [];
    public agentchecks: SelectKeyValue[] = [];

    public readonly PermissionsService = inject(PermissionsService);


    private subscriptions: Subscription = new Subscription();
    private readonly ImportedhostsService = inject(ImportedhostsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.loadImportedHost(id);
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadImportedHost(id: number): void {
        this.subscriptions.add(this.ImportedhostsService.getEdit(id).subscribe((response) => {
            this.post = response;

            this.loadContainer();
            this.loadElements();

            this.cdr.markForCheck();
        }));
    }

    public loadContainer(): void {
        this.subscriptions.add(this.ImportedhostsService.loadContainers().subscribe((response) => {
            this.containers = response;

            this.cdr.markForCheck();
        }));
    }

    public hasFlag(importedHostFlag: number, compareFlag: ImportedHostFlagsEnum) {
        return importedHostFlag & compareFlag;
    }

    public onContainerChange() {
        this.loadElements();
    }

    public loadElements(): void {
        if (!this.post) {
            return;
        }

        this.subscriptions.add(this.ImportedhostsService.loadElements(this.post.container_id).subscribe((response) => {
            this.sharingContainers = response.sharingContainers;
            this.hosttemplates = response.hosttemplates;
            this.servicetemplates = response.servicetemplates;
            this.servicetemplategroups = response.servicetemplategroups;
            this.satellites = response.satellites;
            this.agentchecks = response.agentchecks;

            this.cdr.markForCheck();
        }));
    }

    public submit() {
        this.subscriptions.add(this.ImportedhostsService.saveImportedHostEdit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();

                if (result.success) {
                    const response = result.data as ImportedHostPost;

                    const title = this.TranslocoService.translate('Imported host');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['import_module', 'ImportedHosts', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/import_module/ImportedHosts/index']);
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            }));
    }

    protected readonly ImportedHostFlagsEnum = ImportedHostFlagsEnum;
    protected readonly ROOT_CONTAINER = ROOT_CONTAINER;
}
