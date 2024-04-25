import { Component, EventEmitter, Inject, inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import {
    ButtonCloseDirective,
    ButtonDirective,
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
import { TranslocoDirective } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { DeleteAllItem, DeleteAllResponse } from './delete-all.interface';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'oitc-delete-all-modal',
    standalone: true,
    imports: [
        ModalComponent,
        ModalHeaderComponent,
        ModalBodyComponent,
        ModalTitleDirective,
        ButtonCloseDirective,
        ModalFooterComponent,
        ButtonDirective,
        TranslocoDirective,
        RowComponent,
        ColComponent,
        NgForOf,
        FaIconComponent,
        ProgressComponent,
        NgIf,
        JsonPipe
    ],
    templateUrl: './delete-all-modal.component.html',
    styleUrl: './delete-all-modal.component.css'
})
export class DeleteAllModalComponent implements OnInit, OnDestroy {

    @Input({required: true}) public items: DeleteAllItem[] = [];
    @Input({required: false}) public deleteMessage: string = '';
    @Input({required: false}) public helpMessage: string = '';
    @Output() completed = new EventEmitter<boolean>();


    public isDeleting: boolean = false;
    public percentage: number = 0;
    public hasErrors: boolean = false;
    public errors: DeleteAllResponse[] = [];

    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    @ViewChild('modal') private modal!: ModalComponent;

    constructor(@Inject(DELETE_SERVICE_TOKEN) private deleteService: any) {
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
            id: 'deleteAllModal'
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

            this.deleteService.delete(item).subscribe({
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
                    const responseError = error.error as DeleteAllResponse;
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

    public currentItemHasErrors(item: DeleteAllItem): boolean {
        return this.errors.some((error) => error.id == item.id);
    }

    public getErrorsForItem(item: DeleteAllItem): DeleteAllResponse[] {
        return this.errors.filter((error) => error.id == item.id);
    }
}
