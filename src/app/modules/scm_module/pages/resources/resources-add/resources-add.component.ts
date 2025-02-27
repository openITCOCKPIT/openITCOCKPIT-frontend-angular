import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckInputDirective,
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { HistoryService } from '../../../../../history.service';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { ResourcesService } from '../resources.service';
import { ResourcesPost } from '../resources.interface';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';

@Component({
    selector: 'oitc-resources-add',
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
        FormCheckInputDirective
    ],
    templateUrl: './resources-add.component.html',
    styleUrl: './resources-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcesAddComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    public post = this.getClearForm();
    public createAnother: boolean = false;
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private ResourcesService = inject(ResourcesService);
    public resourcegroups: SelectKeyValue[] = [];
    private resourcegroupId: number = 0;


    private router: Router = inject(Router);


    private cdr = inject(ChangeDetectorRef);
    public errors: GenericValidationError | null = null;

    constructor(private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            let resourcegroupId = params['resourcegroupId'];
            if (resourcegroupId === undefined) {
                resourcegroupId = 0;
            }
            this.resourcegroupId = Number(resourcegroupId);
            this.post = this.getClearForm();
            this.cdr.markForCheck();
        });

        this.resourcegroupId = Number(this.route.snapshot.paramMap.get('resourcegroupId'));
        this.loadResourcegroups();
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

    public getClearForm(): ResourcesPost {
        return {
            name: '',
            description: '',
            resourcegroup_id: this.resourcegroupId
        }
    }

    public submit() {
        this.subscriptions.add(this.ResourcesService.createResource(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;

                    const title = this.TranslocoService.translate('Resource');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['scm_module', 'resources', 'edit', response.id];
                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/scm_module/resources/index']);
                        this.notyService.scrollContentDivToTop();
                        return;
                    }

                    this.post = this.getClearForm();
                    this.ngOnInit();
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
