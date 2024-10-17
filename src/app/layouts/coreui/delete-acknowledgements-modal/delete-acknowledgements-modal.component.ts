import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {
    ButtonCloseDirective,
    ColComponent,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ProgressComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../xsbutton-directive/xsbutton.directive';
import { DisableResponse } from '../disable-modal/disable.interface';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { DELETE_ACKNOWLEDGEMENT_SERVICE_TOKEN } from '../../../tokens/delete-acknowledgement-injection.token';
import { NotyService } from '../noty.service';
import { DeleteAcknowledgementItem } from '../../../pages/acknowledgements/acknowledgement.interface';

@Component({
    selector: 'oitc-delete-acknowledgements-modal',
    standalone: true,
    imports: [
        ButtonCloseDirective,
        ColComponent,
        FaIconComponent,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        NgForOf,
        NgIf,
        ProgressComponent,
        RowComponent,
        TranslocoDirective,
        XsButtonDirective
    ],
    templateUrl: './delete-acknowledgements-modal.component.html',
    styleUrl: './delete-acknowledgements-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})

// This component can be used to delete acknowledgements for hosts and services.
export class DeleteAcknowledgementsModalComponent implements OnInit, OnDestroy {
    @Input({required: true}) public items: DeleteAcknowledgementItem[] = [];
    @Input({required: false}) public helpMessage: string = '';
    @Output() completed = new EventEmitter<boolean>();


    public isDeleting: boolean = false;
    public percentage: number = 0;

    private readonly modalService = inject(ModalService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);

    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);


    @ViewChild('modal') private modal!: ModalComponent;

    constructor(@Inject(DELETE_ACKNOWLEDGEMENT_SERVICE_TOKEN) private deleteAcknowledgementService: any) {
    }

    ngOnInit() {
        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public hideModal() {
        this.isDeleting = false;
        this.percentage = 0;

        this.cdr.markForCheck();

        this.modalService.toggle({
            show: false,
            id: 'deleteAcknowledgements'
        });
    }

    public delete() {
        if (this.items.length === 0) {
            return;
        }

        this.isDeleting = true;
        this.percentage = 0;
        let count = this.items.length;
        let responseCount: number = 0
        let issueCount: number = 0;

        for (let i in this.items) {
            const item = this.items[i];

            this.deleteAcknowledgementService.deleteAcknowledgement(item).subscribe({
                next: (value: any) => {
                    responseCount++
                    this.percentage = Math.round((responseCount / count) * 100);

                    if (responseCount === count && issueCount === 0) {


                        const title = this.TranslocoService.translate('Acknowledgement deleted');
                        const msg = this.TranslocoService.translate('Commands added successfully to queue');

                        this.notyService.genericSuccess(msg, title);

                        this.isDeleting = false;
                        this.percentage = 0;

                        this.hideModal();
                        setTimeout(() => {
                            // Give Naemon sime time to process the commands
                            this.completed.emit(true);
                        }, 5000);
                    }

                },
                error: (error: HttpErrorResponse) => {
                    const responseError = error.error as DisableResponse;
                    issueCount++

                    responseCount++;
                    this.percentage = Math.round((responseCount / count) * 100);

                    if (responseCount === count && issueCount > 0) {
                        // The timeout is not necessary. It is just to show the progress bar at 100% for a short time.
                        setTimeout(() => {
                            this.isDeleting = false;
                            this.percentage = 0;
                        }, 250);

                        this.notyService.genericError();

                        this.completed.emit(false);
                    }
                }
            });
        }
    }

}
