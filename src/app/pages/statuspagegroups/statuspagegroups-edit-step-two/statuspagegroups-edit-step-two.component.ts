import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { StatuspagegroupPost, StatuspageMatrixItem, StatuspagesMembershipPost } from '../statuspagegroups.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { StatuspagegroupsService } from '../statuspagegroups.service';
import { HistoryService } from '../../../history.service';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';

@Component({
    selector: 'oitc-statuspagegroups-edit-step-two',
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        FormLoaderComponent,
        BackButtonDirective,
        BadgeComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        FormDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        ReactiveFormsModule,
        RowComponent,
        TranslocoPipe,
        XsButtonDirective,
        TableDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        MultiSelectComponent
    ],
    templateUrl: './statuspagegroups-edit-step-two.component.html',
    styleUrl: './statuspagegroups-edit-step-two.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatuspagegroupsEditStepTwoComponent implements OnInit, OnDestroy {

    public post?: StatuspagegroupPost;
    public errors: GenericValidationError | null = null;

    public statuspages: SelectKeyValue[] = [];
    //public statuspageMatrix: number[][][] = [];
    public statuspageMatrix: StatuspageMatrixItem[][] = [];

    private subscriptions: Subscription = new Subscription();
    private readonly StatuspagegroupsService = inject(StatuspagegroupsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.loadStatuspagegroup(id);
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadStatuspagegroup(id: number) {
        this.subscriptions.add(this.StatuspagegroupsService.getStatuspagegroupEditStepTwo(id).subscribe(result => {
            this.post = result.statuspagegroup;
            this.statuspages = result.statuspages;

            // Create matrix for easier access
            this.statuspageMatrix = this.createStatuspageMatrix();
            this.assignStatuspagesToMatrix();

            this.cdr.markForCheck();
        }));
    }

    private createStatuspageMatrix(): StatuspageMatrixItem[][] {
        // The "matrix" array will represent the table structure as array
        // [row [columns [statuspageIds]]]
        const matrix: StatuspageMatrixItem[][] = [];
        if (this.post && this.post.statuspagegroup_collections) {
            this.post.statuspagegroup_collections.forEach((collection, collectionIndex) => {
                matrix[collectionIndex] = [];
                if (this.post) {
                    this.post.statuspagegroup_categories.forEach((category, categoryIndex) => {
                        matrix[collectionIndex][categoryIndex] = {
                            collectionIndex: collectionIndex,
                            collectionId: Number(collection.id),
                            categoryIndex: categoryIndex,
                            categoryId: Number(category.id),
                            statuspageIds: []
                        };
                    });
                }
            });
        }

        return matrix;
    }

    private assignStatuspagesToMatrix() {
        if (this.post) {
            // Map collection IDs to their index in the post.statuspagegroup_collections array
            const collectionIndexMapping = new Map<number, number>();
            this.post.statuspagegroup_collections.forEach((collection, index) => {
                if (collection.id) {
                    collectionIndexMapping.set(collection.id, index);
                }
            });

            // Map category IDs to their index in the post.statuspagegroup_categories array
            const categoryIndexMapping = new Map<number, number>();
            this.post.statuspagegroup_categories.forEach((category, index) => {
                if (category.id) {
                    categoryIndexMapping.set(category.id, index);
                }
            });

            // Assign statuspages to the matrix based on their collection_id and category_id
            for (const statuspage_membership of this.post.statuspages_memberships) {
                const collectionIndex = collectionIndexMapping.get(Number(statuspage_membership.collection_id));
                const categoryIndex = categoryIndexMapping.get(Number(statuspage_membership.category_id));
                if (collectionIndex !== undefined && categoryIndex !== undefined) {
                    this.statuspageMatrix[collectionIndex][categoryIndex].statuspageIds.push(Number(statuspage_membership.statuspage_id));
                }
            }
        }
    }

    private convertMatrixIntoMembershipPost(): StatuspagesMembershipPost[] {
        const memberships: StatuspagesMembershipPost[] = [];

        this.statuspageMatrix.forEach((collection, collectionIndex) => {
            collection.forEach((category, categoryIndex) => {
                category.statuspageIds.forEach((statuspageId) => {
                    memberships.push({
                        statuspagegroup_id: Number(this.post?.id),
                        collection_id: category.collectionId,
                        category_id: category.categoryId,
                        statuspage_id: statuspageId
                    });
                });
            });
        });

        return memberships;
    }

    public submit() {
        if (!this.post) {
            return;
        }

        this.post.statuspages_memberships = this.convertMatrixIntoMembershipPost();

        this.subscriptions.add(this.StatuspagegroupsService.saveStatuspagegroupEditStepTwo(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Status page group');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['statuspagegroups', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.notyService.scrollContentDivToTop();

                    this.errors = null;

                    // The history service would navigate back to step one, so we use the router directly
                    this.router.navigate(['/statuspagegroups/index']);
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
