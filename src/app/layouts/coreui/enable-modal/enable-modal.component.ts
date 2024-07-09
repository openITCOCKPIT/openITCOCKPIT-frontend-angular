import { Component, EventEmitter, Inject, inject, Input, Output, ViewChild } from '@angular/core';
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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ENABLE_SERVICE_TOKEN } from '../../../tokens/enable-injection.token';
import { EnableItem } from './enable.interface';

@Component({
    selector: 'oitc-enable-modal',
    standalone: true,
    imports: [
        ButtonCloseDirective,
        ButtonDirective,
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
        TranslocoDirective
    ],
    templateUrl: './enable-modal.component.html',
    styleUrl: './enable-modal.component.css'
})
export class EnableModalComponent {
    @Input({required: true}) public items: EnableItem[] = [];
    @Input({required: false}) public enableMessage: string = '';
    @Input({required: false}) public helpMessage: string = '';
    @Output() completed = new EventEmitter<boolean>();


    public isEnable: boolean = false;
    public percentage: number = 0;
    public hasErrors: boolean = false;

    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    @ViewChild('modal') private modal!: ModalComponent;

    constructor(@Inject(ENABLE_SERVICE_TOKEN) private enableService: any) {
    }

    ngOnInit() {
        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public hideModal() {
        this.isEnable = false;
        this.percentage = 0;
        this.hasErrors = false;

        this.modalService.toggle({
            show: false,
            id: 'enableModal'
        });
    }

    public enable() {
        if (this.items.length === 0) {
            return;
        }

        this.isEnable = true;
        this.percentage = 0;
        let count = this.items.length;
        let responseCount: number = 0
        let issueCount: number = 0;

        // Delete any old errors

        for (let i in this.items) {
            const item = this.items[i];

            this.enableService.enable(item).subscribe({
                next: (value: any) => {
                    responseCount++
                    this.percentage = Math.round((responseCount / count) * 100);

                    if (responseCount === count && issueCount === 0) {
                        // The timeout is not necessary. It is just to show the progress bar at 100% for a short time.
                        setTimeout(() => {
                            this.isEnable = false;
                            this.percentage = 0;
                            this.hasErrors = false;

                            this.hideModal();
                        }, 250);
                        this.completed.emit(true);
                    }

                },
                error: (error: HttpErrorResponse) => {
                    // This API does not return any errors
                    // The only error could be a network error

                    issueCount++
                    this.hasErrors = true;

                    responseCount++;
                    this.percentage = Math.round((responseCount / count) * 100);

                    if (responseCount === count && issueCount > 0) {
                        // The timeout is not necessary. It is just to show the progress bar at 100% for a short time.
                        setTimeout(() => {
                            this.isEnable = false;
                            this.percentage = 0;
                        }, 250);
                        this.completed.emit(false);
                    }
                }
            });
        }
    }

}
