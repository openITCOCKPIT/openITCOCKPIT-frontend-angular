import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { HistoryService } from '../../../../../history.service';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { ResourcesService } from '../resources.service';
import { ResourcesPost } from '../resources.interface';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';


@Component({
    selector: 'oitc-resources-edit',
    imports: [
    BackButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FaIconComponent,
    FormControlDirective,
    FormDirective,
    FormErrorDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    FormsModule,
    NavComponent,
    NavItemComponent,
    PermissionDirective,
    ReactiveFormsModule,
    RequiredIconComponent,
    SelectComponent,
    TranslocoDirective,
    XsButtonDirective,
    RouterLink,
    CardFooterComponent,
    FormLoaderComponent
],
    templateUrl: './resources-edit.component.html',
    styleUrl: './resources-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcesEditComponent implements OnInit, OnDestroy {
    private id: number = 0;
    private subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    public post!: ResourcesPost;
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private ResourcesService = inject(ResourcesService);
    public resourcegroups: SelectKeyValue[] = [];

    private cdr = inject(ChangeDetectorRef);
    public errors: GenericValidationError | null = null;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadResource();
    }

    public loadResource() {
        this.subscriptions.add(this.ResourcesService.getEdit(this.id)
            .subscribe((result) => {
                //Fire on page load
                this.post = result.resource.Resource;
                this.cdr.markForCheck();
                this.loadResourcegroups();
            }));
    }

    public loadResourcegroups = (): void => {
        this.subscriptions.add(this.ResourcesService.loadResourcegroups()
            .subscribe((result: SelectKeyValue[]) => {
                this.resourcegroups = result;
                this.cdr.markForCheck();
            }));
    }


    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }


    public submit() {
        this.subscriptions.add(this.ResourcesService.edit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('Resource');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['scm_module', 'resources', 'edit', response.id];
                    this.notyService.genericSuccess(msg, title, url);

                    this.HistoryService.navigateWithFallback(['/scm_module/resources/index']);
                    this.notyService.scrollContentDivToTop();
                    this.errors = null;
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
}
