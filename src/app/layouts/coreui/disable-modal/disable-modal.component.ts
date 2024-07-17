import { Component, EventEmitter, Inject, inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
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
    RowComponent,
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { DisableItem, DisableResponse } from './disable.interface';
import { Subscription } from 'rxjs';
import { DISABLE_SERVICE_TOKEN } from '../../../tokens/disable-injection.token';
import { HttpErrorResponse } from '@angular/common/http';
import { XsButtonDirective } from '../xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-disable-modal',
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
    templateUrl: './disable-modal.component.html',
    styleUrl: './disable-modal.component.css'
})
export class DisableModalComponent implements OnInit, OnDestroy {
    @Input({required: true}) public items: DisableItem[] = [];
    @Input({required: false}) public disableMessage: string = '';
    @Input({required: false}) public helpMessage: string = '';
    @Output() completed = new EventEmitter<boolean>();


    public isDisable: boolean = false;
    public percentage: number = 0;
    public hasErrors: boolean = false;
    public errors: DisableResponse[] = [];

    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    @ViewChild('modal') private modal!: ModalComponent;

    constructor(@Inject(DISABLE_SERVICE_TOKEN) private disableService: any) {
    }

    ngOnInit() {
        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public hideModal() {
        this.isDisable = false;
        this.percentage = 0;
        this.hasErrors = false;
        this.errors = [];

        this.modalService.toggle({
            show: false,
            id: 'disableModal'
        });
    }

    public disable() {
        if (this.items.length === 0) {
            return;
        }

        this.isDisable = true;
        this.percentage = 0;
        let count = this.items.length;
        let responseCount: number = 0
        let issueCount: number = 0;

        // Delete any old errors
        this.errors = [];


        for (let i in this.items) {
            const item = this.items[i];

            this.disableService.disable(item).subscribe({
                next: (value: any) => {
                    responseCount++
                    this.percentage = Math.round((responseCount / count) * 100);

                    if (responseCount === count && issueCount === 0) {
                        // The timeout is not necessary. It is just to show the progress bar at 100% for a short time.
                        setTimeout(() => {
                            this.isDisable = false;
                            this.percentage = 0;
                            this.hasErrors = false;
                            this.errors = [];

                            this.hideModal();
                        }, 250);
                        this.completed.emit(true);
                    }

                },
                error: (error: HttpErrorResponse) => {
                    const responseError = error.error as DisableResponse;
                    issueCount++
                    this.hasErrors = true;
                    this.errors.push(responseError);

                    responseCount++;
                    this.percentage = Math.round((responseCount / count) * 100);

                    if (responseCount === count && issueCount > 0) {
                        // The timeout is not necessary. It is just to show the progress bar at 100% for a short time.
                        setTimeout(() => {
                            this.isDisable = false;
                            this.percentage = 0;
                        }, 250);
                        this.completed.emit(false);
                    }
                }
            });
        }
    }

    public currentItemHasErrors(item: DisableItem): boolean {
        return this.errors.some((error) => error.id == item.id);
    }

    public getErrorsForItem(item: DisableItem): DisableResponse[] {
        return this.errors.filter((error) => error.id == item.id);
    }
}
