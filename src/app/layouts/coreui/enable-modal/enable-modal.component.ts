import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    inject,
    Input,
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
    RowComponent,
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ENABLE_SERVICE_TOKEN } from '../../../tokens/enable-injection.token';
import { EnableItem } from './enable.interface';
import { GenericActionErrorResponse } from '../../../generic-responses';
import { XsButtonDirective } from '../xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-enable-modal',
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
    templateUrl: './enable-modal.component.html',
    styleUrl: './enable-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnableModalComponent {
    @Input({required: true}) public items: EnableItem[] = [];
    @Input({required: false}) public enableMessage: string = '';
    @Input({required: false}) public helpMessage: string = '';
    @Output() completed = new EventEmitter<boolean>();

    public isEnable: boolean = false;
    public percentage: number = 0;
    public hasErrors: boolean = false;
    public errors: GenericActionErrorResponse[] = [];

    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);
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
        this.errors = [];

        this.cdr.markForCheck();

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
        this.errors = [];

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
                            this.errors = [];

                            this.hideModal();
                        }, 250);
                        this.completed.emit(true);
                    }

                },
                error: (error: HttpErrorResponse) => {
                    // The /enable endpoint for hosts does not return any errors
                    // The only error could be a network error
                    //
                    // The /enable endpoint for services can return an error if the host is not enabled

                    issueCount++
                    this.hasErrors = true;

                    if (error.hasOwnProperty('error')) {
                        if (error.error.hasOwnProperty('message')) {
                            this.errors.push((error.error as GenericActionErrorResponse));
                        }
                    }

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

    public currentItemHasErrors(item: EnableItem): boolean {
        return this.errors.some((error) => Number(error.id) == item.id);
    }

    public getErrorsForItem(item: EnableItem): GenericActionErrorResponse[] {
        return this.errors.filter((error) => Number(error.id) == item.id);
    }

}
