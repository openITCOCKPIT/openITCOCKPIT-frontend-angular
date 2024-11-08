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
    BadgeComponent,
    ButtonCloseDirective,
    ColComponent,
    FormControlDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    RowComponent
} from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { HttpErrorResponse } from '@angular/common/http';
import { GenericValidationError } from '../../../../generic-responses';
import { CustomAlertsService } from '../../pages/customalerts/customalerts.service';
import { FormFeedbackComponent } from '../../../../layouts/coreui/form-feedback/form-feedback.component';
import { Customalert } from '../../pages/customalerts/customalerts.interface';

@Component({
    selector: 'oitc-customalerts-close-modal',
    standalone: true,
    imports: [
        ModalComponent,
        TranslocoDirective,
        ButtonCloseDirective,
        ModalHeaderComponent,
        ModalTitleDirective,
        FaIconComponent,
        ModalBodyComponent,
        AlertComponent,
        NgIf,
        ColComponent,
        NgForOf,
        RowComponent,
        FormControlDirective,
        BadgeComponent,
        FormsModule,
        ModalFooterComponent,
        XsButtonDirective,
        FormFeedbackComponent
    ],
    templateUrl: './customalerts-close-modal.component.html',
    styleUrl: './customalerts-close-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomalertsCloseModalComponent {
    private readonly modalService = inject(ModalService);
    private readonly CustomAlertsService = inject(CustomAlertsService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected comment: string = '';
    protected acknowlage: boolean = true;
    protected isProcessing: boolean = false;
    protected percentage: number = 0;
    protected hasErrors: boolean = false;
    protected errors: GenericValidationError | null = null;

    @Input({required: true}) public items: Customalert[] = [];
    @Output() completed = new EventEmitter<boolean>();

    protected closeManually(): void {
        // Iterate all elements of this.items and call this.CustomAlertsService.annotate
        // with the appropriate arguments for each element.
        this.isProcessing = true;

        for (let i in this.items) {
            const item = this.items[i];
            let responseCount = 0;
            let count = this.items.length;
            let issueCount = 0;


            this.CustomAlertsService.closeManually(item.id, this.comment).subscribe({
                next: (value: any) => {
                    responseCount++
                    this.percentage = Math.round((responseCount / count) * 100);

                    if (responseCount === count && issueCount === 0) {
                        // The timeout is not necessary. It is just to show the progress bar at 100% for a short time.
                        setTimeout(() => {

                            this.hideModal();
                        }, 250);
                        this.completed.emit(true);
                    }

                },
                error: (error: HttpErrorResponse) => {
                    this.cdr.markForCheck();
                    this.errors = error.error.error as GenericValidationError
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
            id: 'customalertsCloseModal'
        });
        this.reset();
    }

    private reset(): void {
        // All records have been deleted successfully. Reset the modal
        this.acknowlage = true;
        this.isProcessing = false;
        this.percentage = 0;
        this.hasErrors = false;
        this.comment = '';
        this.errors = null;
        this.items = [];
    }
}
