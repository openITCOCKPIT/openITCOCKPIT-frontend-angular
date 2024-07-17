import { Component, EventEmitter, Inject, inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import {
    ButtonCloseDirective,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ProgressComponent,
    RowComponent,
} from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { CancelAllItem, CancelAllResponse } from './cancel-servicedowntime.interface';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { HttpErrorResponse } from '@angular/common/http';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';


@Component({
    selector: 'oitc-cancel-servicedowntime-modal',
    standalone: true,
    imports: [
        ModalComponent,
        ModalHeaderComponent,
        ModalBodyComponent,
        ModalTitleDirective,
        ButtonCloseDirective,
        ModalFooterComponent,
        TranslocoDirective,
        RowComponent,
        ColComponent,
        NgForOf,
        FaIconComponent,
        ProgressComponent,
        NgIf,
        JsonPipe,
        DebounceDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormsModule,
        TrueFalseDirective,
        XsButtonDirective
    ],
    templateUrl: './cancel-servicedowntime-modal.component.html',
    styleUrl: './cancel-servicedowntime-modal.component.css'

})
export class CancelServicedowntimeModalComponent implements OnInit, OnDestroy {

    @Input({required: true}) public items: CancelAllItem[] = [];
    @Input({required: false}) public deleteMessage: string = '';
    @Input({required: false}) public helpMessage: string = '';
    @Output() completed = new EventEmitter<boolean>();

    public isDeleting: boolean = false;
    public percentage: number = 0;
    public hasErrors: boolean = false;
    public errors: CancelAllResponse[] = [];

    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    @ViewChild('modal') private modal!: ModalComponent;

    constructor(@Inject(DELETE_SERVICE_TOKEN) private DowntimesService: any) {
    }

    ngOnInit() {
        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
            //console.log(state);
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public hideModal() {
        this.isDeleting = false;
        this.percentage = 0;
        this.hasErrors = false;
        this.errors = [];

        this.modalService.toggle({
            show: false,
            id: 'cancelAllModal'
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

        // Delete any old errors
        this.errors = [];


        for (let i in this.items) {
            const item = this.items[i];
            this.DowntimesService.deleteServicedowntime(item).subscribe({
                next: (value: any) => {
                    responseCount++
                    this.percentage = Math.round((responseCount / count) * 100);

                    if (responseCount === count && issueCount === 0) {
                        // The timeout is not necessary. It is just to show the progress bar at 100% for a short time.
                        setTimeout(() => {
                            // All records have been deleted successfully. Reset the modal
                            this.isDeleting = false;
                            this.percentage = 0;
                            this.hasErrors = false;
                            this.errors = [];

                            this.hideModal();
                        }, 250);
                        this.completed.emit(true);
                    }

                },
                error: (error: HttpErrorResponse) => {
                    const responseError = error.error as CancelAllResponse;
                    issueCount++
                    this.hasErrors = true;
                    this.errors.push(responseError);

                    responseCount++;
                    this.percentage = Math.round((responseCount / count) * 100);

                    if (responseCount === count && issueCount > 0) {
                        // The timeout is not necessary. It is just to show the progress bar at 100% for a short time.
                        setTimeout(() => {
                            this.isDeleting = false;
                            this.percentage = 0;
                        }, 250);
                        this.completed.emit(false);
                    }
                }
            });
        }
    }
}
