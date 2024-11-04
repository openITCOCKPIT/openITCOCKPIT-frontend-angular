import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    Output
} from '@angular/core';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import {
    AlertComponent,
    ButtonCloseDirective,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormControlDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective, ProgressComponent,
    RowComponent,
    TextColorDirective
} from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DebounceDirective } from '../../../../directives/debounce.directive';
import { CustomAlertsService } from '../../pages/customalerts/customalerts.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormFeedbackComponent } from '../../../../layouts/coreui/form-feedback/form-feedback.component';
import { GenericValidationError } from '../../../../generic-responses';

@Component({
    selector: 'oitc-customalerts-annotate-modal',
    standalone: true,
    imports: [
        ModalComponent,
        TranslocoDirective,
        ButtonCloseDirective,
        FaIconComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        AlertComponent,
        ColComponent,
        FormControlDirective,
        ModalBodyComponent,
        ModalFooterComponent,
        NgForOf,
        ReactiveFormsModule,
        RowComponent,
        XsButtonDirective,
        FormsModule,
        FormCheckComponent,
        FormCheckInputDirective,
        TextColorDirective,
        DebounceDirective,
        ProgressComponent,
        FormFeedbackComponent
    ],
    templateUrl: './customalerts-annotate-modal.component.html',
    styleUrl: './customalerts-annotate-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomalertsAnnotateModalComponent {
    private readonly modalService = inject(ModalService);
    private readonly CustomAlertsService = inject(CustomAlertsService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected comment: string = '';
    protected acknowlage: boolean = true;
    protected isProcessing: boolean = false;
    protected percentage: number = 0;
    protected hasErrors: boolean = false;
    protected errors: GenericValidationError | null = null;

    @Input({required: true}) public items: DeleteAllItem[] = [];
    @Output() completed = new EventEmitter<boolean>();

    protected annotate(): void {
        // Iterate all elements of this.items and call this.CustomAlertsService.annotate
        // with the appropriate arguments for each element.
        this.isProcessing = true;

        for (let i in this.items) {
            const item = this.items[i];
            let responseCount = 0;
            let count = this.items.length;
            let issueCount = 0;


            this.CustomAlertsService.annotate(item.id, this.comment, false, false).subscribe({
                next: (value: any) => {
                    console.warn('value', value);
                    responseCount++
                    this.percentage = Math.round((responseCount / count) * 100);

                    if (responseCount === count && issueCount === 0) {
                        // The timeout is not necessary. It is just to show the progress bar at 100% for a short time.
                        setTimeout(() => {
                            // All records have been deleted successfully. Reset the modal
                            this.isProcessing = false;
                            this.percentage = 0;
                            this.hasErrors = false;
                            this.errors = null;

                            this.hideModal();
                        }, 250);
                        this.completed.emit(true);
                    }

                },
                error: (error: HttpErrorResponse) => {
                    this.cdr.markForCheck();
                    this.errors = error.error.error as GenericValidationError
                    console.warn('responseError', this.errors);
                    issueCount++
                    this.hasErrors = true;

                    responseCount++;
                    this.percentage = Math.round((responseCount / count) * 100);

                    if (responseCount === count && issueCount > 0) {
                        // The timeout is not necessary. It is just to show the progress bar at 100% for a short time.
                        setTimeout(() => {
                            this.isProcessing = false;
                            this.percentage = 0;
                        }, 250);
                        this.completed.emit(false);
                    }
                }
            });
        }
    }

    protected hideModal(): void {
        this.modalService.toggle({
            show: false,
            id: 'customalertsAnnotateModal'
        });
    }
}
