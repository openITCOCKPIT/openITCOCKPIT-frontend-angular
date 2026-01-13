import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {
    AlertComponent,
    ButtonCloseDirective,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ProgressComponent,
    RowComponent,
    TextColorDirective
} from '@coreui/angular';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DebounceDirective } from '../../../../directives/debounce.directive';
import { CustomAlertsService } from '../../pages/customalerts/customalerts.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormFeedbackComponent } from '../../../../layouts/coreui/form-feedback/form-feedback.component';
import { GenericValidationError } from '../../../../generic-responses';
import {
    CheckHoststatusForAcknowledgementsRequest,
    CheckHoststatusForAcknowledgementsResponse,
    Customalert,
    CustomAlertsState
} from '../../pages/customalerts/customalerts.interface';
import { Subscription } from 'rxjs';

@Component({
    selector: 'oitc-customalerts-annotate-modal',
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
    ReactiveFormsModule,
    RowComponent,
    XsButtonDirective,
    FormsModule,
    FormCheckComponent,
    FormCheckInputDirective,
    TextColorDirective,
    DebounceDirective,
    ProgressComponent,
    FormFeedbackComponent,
    FormCheckLabelDirective,
    NgClass
],
    templateUrl: './customalerts-annotate-modal.component.html',
    styleUrl: './customalerts-annotate-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomalertsAnnotateModalComponent implements OnInit {
    private readonly modalService = inject(ModalService);
    private readonly CustomAlertsService = inject(CustomAlertsService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected result?: CheckHoststatusForAcknowledgementsResponse;
    protected loadingHoststate: boolean = false;
    protected comment: string = '';
    protected acknowlage: boolean = true;
    protected isProcessing: boolean = false;
    protected percentage: number = 0;
    protected hasErrors: boolean = false;
    protected errors: GenericValidationError | null = null;

    @Input({required: true}) public items: Customalert[] = [];
    @Output() completed = new EventEmitter<boolean>();

    constructor() {
    }

    public ngOnInit(): void {
        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
            if (state.id === 'customalertsAnnotateModal' && state.show === true) {
                this.cdr.markForCheck();
                this.checkHoststatusForAcknowledgements();
            }
        }));
    }

//
    protected checkHoststatusForAcknowledgements = () => {
        this.loadingHoststate = true;
        this.cdr.markForCheck();
        let params: CheckHoststatusForAcknowledgementsRequest = {
            hostIds: this.items.map(item => item.service.host.id as unknown as string)
        };

        this.subscriptions.add(this.CustomAlertsService.checkHoststatusForAcknowledgements(params)
            .subscribe((result: CheckHoststatusForAcknowledgementsResponse) => {
                this.result = result;
                this.loadingHoststate = false;
                this.cdr.markForCheck();
            })
        );
    }

    protected annotate(): void {
        // Iterate all elements of this.items and call this.CustomAlertsService.annotate
        // with the appropriate arguments for each element.
        this.errors = null;

        if (this.comment.length === 0) {
            this.errors = {
                comment: {
                    _empty: this.TranslocoService.translate('This field cannot be left empty')
                }
            }
            ;
            return;
        }
        this.isProcessing = true;

        let count = this.items.length;
        let responseCount = 0;
        let issueCount = 0;

        for (let i in this.items) {
            const item = this.items[i];

            this.CustomAlertsService.annotate(item.id, this.comment, true, this.acknowlage).subscribe({
                next: (value: any) => {
                    responseCount++
                    this.percentage = Math.round((responseCount / count) * 100);

                    if (responseCount === count && issueCount === 0) {
                        this.hideModal();
                        this.completed.emit(true);
                    }
                    this.cdr.markForCheck();
                },
                error: (error: HttpErrorResponse) => {
                    this.cdr.markForCheck();
                    this.errors = error.error.error as GenericValidationError
                    issueCount++
                    this.hasErrors = true;

                    responseCount++;

                    if (responseCount === count && issueCount > 0) {
                        // The timeout is not necessary. It is just to show the progress bar at 100% for a short time.
                        setTimeout(() => {
                            this.isProcessing = false;
                            this.percentage = 0;
                        }, 250);
                        this.completed.emit(false);
                    }
                    this.cdr.markForCheck();
                }
            });
        }
    }

    protected hideModal(): void {
        this.modalService.toggle({
            show: false,
            id: 'customalertsAnnotateModal'
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

    protected readonly CustomAlertsState = CustomAlertsState;
}
