import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { StatuspagegroupPost } from '../statuspagegroups.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { StatuspagegroupsService } from '../statuspagegroups.service';
import { HistoryService } from '../../../history.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BackButtonDirective } from '../../../directives/back-button.directive';
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
    TableDirective
} from '@coreui/angular';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-statuspagegroups-edit-step-one',
    imports: [
        FaIconComponent,
        FormLoaderComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        BackButtonDirective,
        BadgeComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        ReactiveFormsModule,
        RequiredIconComponent,
        RowComponent,
        SelectComponent,
        TranslocoPipe,
        XsButtonDirective,
        TableDirective,
        InputGroupComponent,
        InputGroupTextDirective
    ],
    templateUrl: './statuspagegroups-edit-step-one.component.html',
    styleUrl: './statuspagegroups-edit-step-one.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatuspagegroupsEditStepOneComponent implements OnInit, OnDestroy {

    public post?: StatuspagegroupPost;
    public errors: GenericValidationError | null = null;
    public collectionErrors: { [key: number]: GenericValidationError } = {};
    public categoryErrors: { [key: number]: GenericValidationError } = {};


    public containers: SelectKeyValue[] = [];

    private subscriptions: Subscription = new Subscription();
    private readonly StatuspagegroupsService = inject(StatuspagegroupsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.loadContainers();
        this.route.queryParams.subscribe(params => {
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.loadStatuspagegroup(id);
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadStatuspagegroup(id: number) {
        this.subscriptions.add(this.StatuspagegroupsService.getStatuspagegroupEdit(id).subscribe(statuspagegroup => {
            this.post = statuspagegroup;
            this.cdr.markForCheck();
        }));
    }

    public loadContainers() {
        this.subscriptions.add(this.StatuspagegroupsService.loadContainers()
            .subscribe((result) => {
                this.containers = result;
                this.cdr.markForCheck();
            })
        );
    }

    public addCollection() {
        if (!this.post) {
            return;
        }

        this.post.statuspagegroup_collections = [...this.post.statuspagegroup_collections, {
            name: '',
            description: ''
        }];
        this.cdr.markForCheck();
    }

    public removeCollection(index: number) {
        if (!this.post) {
            return;
        }

        this.post.statuspagegroup_collections = this.post.statuspagegroup_collections.filter((_, i) => i !== index);

        // Reset any errors as if a collection is removed, the errors index will be off
        this.collectionErrors = {};

        this.cdr.markForCheck();
    }

    public addCategory() {
        if (!this.post) {
            return;
        }

        this.post.statuspagegroup_categories = [...this.post.statuspagegroup_categories, {
            name: ''
        }];
        this.cdr.markForCheck();
    }

    public removeCategory(index: number) {
        if (!this.post) {
            return;
        }

        this.post.statuspagegroup_categories = this.post.statuspagegroup_categories.filter((_, i) => i !== index);

        // Reset any errors as if a category is removed, the errors index will be off
        this.categoryErrors = {};

        this.cdr.markForCheck();
    }

    public submit() {
        if (!this.post) {
            return;
        }

        this.subscriptions.add(this.StatuspagegroupsService.saveStatuspagegroupEdit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Status page group');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['statuspagegroups', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.notyService.scrollContentDivToTop();

                    this.router.navigate(['/statuspagegroups/editStepTwo/', response.id]);
                    this.errors = null;
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;

                    this.collectionErrors = {};
                    if (errorResponse.hasOwnProperty('statuspagegroup_collections')) {
                        for (let i in errorResponse['statuspagegroup_collections']) {
                            const k = Number(i);
                            this.collectionErrors[k] = (errorResponse['statuspagegroup_collections'][i] as any as GenericValidationError);
                        }
                    }

                    this.categoryErrors = {};
                    if (errorResponse.hasOwnProperty('statuspagegroup_categories')) {
                        for (let i in errorResponse['statuspagegroup_categories']) {
                            const k = Number(i);
                            this.categoryErrors[k] = (errorResponse['statuspagegroup_categories'][i] as any as GenericValidationError);
                        }
                    }
                }
            }));
    }

}
