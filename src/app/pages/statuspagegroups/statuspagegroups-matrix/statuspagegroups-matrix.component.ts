import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, model } from '@angular/core';
import { StatuspagegroupCategoryPost, StatuspagegroupCollectionPost } from '../statuspagegroups.interface';
import { GenericValidationError } from '../../../generic-responses';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormControlDirective, InputGroupComponent, InputGroupTextDirective, TableDirective } from '@coreui/angular';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-statuspagegroups-matrix',
    imports: [
        FaIconComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        TableDirective,
        TranslocoPipe,
        XsButtonDirective,
        TranslocoDirective
    ],
    templateUrl: './statuspagegroups-matrix.component.html',
    styleUrl: './statuspagegroups-matrix.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatuspagegroupsMatrixComponent {

    // Two-way binding
    public statuspagegroup_collections = model<StatuspagegroupCollectionPost[]>([]);
    public statuspagegroup_categories = model<StatuspagegroupCategoryPost[]>([]);

    public collectionErrorsInput = input<{ [key: number]: GenericValidationError }>({});
    public collectionErrors: { [key: number]: GenericValidationError } = {};

    public categoryErrorsInput = input<{ [key: number]: GenericValidationError }>({});
    public categoryErrors: { [key: number]: GenericValidationError } = {};

    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    constructor() {

        effect(() => {
            this.collectionErrors = this.collectionErrorsInput();
            this.categoryErrors = this.categoryErrorsInput();
        });
    }

    public addCollection() {
        // Update the two-way binding
        this.statuspagegroup_collections.update((collections) => {
            return [...collections, {
                name: '',
                description: null
            }]
        });

        this.cdr.markForCheck();
    }

    public removeCollection(index: number) {
        // Remove collection from two-way binding
        this.statuspagegroup_collections.update((collections) => {
            return collections.filter((_, i) => i !== index);
        });

        // Reset any errors as if a collection is removed, the errors index will be off
        this.collectionErrors = {};

        this.cdr.markForCheck();
    }

    public addCategory() {
        // Update the two-way binding
        this.statuspagegroup_categories.update((categories) => {
            return [...categories, {
                name: ''
            }]
        });

        this.cdr.markForCheck();
    }

    public removeCategory(index: number) {
        // Remove category from two-way binding
        this.statuspagegroup_categories.update((categories) => {
            return categories.filter((_, i) => i !== index);
        });

        // Reset any errors as if a collection is removed, the errors index will be off
        this.categoryErrors = {};

        this.cdr.markForCheck();
    }

}
