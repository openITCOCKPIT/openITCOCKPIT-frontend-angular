import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
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
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { GrafanaUserdashboardsService } from '../../pages/GrafanaUserdashboards/grafana-userdashboards.service';
import { SynchronizeGrafanaResponse } from './synchronize.interface';

@Component({
    selector: 'oitc-synchronize-grafana-modal',
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
    templateUrl: './synchronize-grafana-modal.component.html',
    styleUrl: './synchronize-grafana-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SynchronizeGrafanaModalComponent implements OnInit, OnDestroy {

    @Input({required: true}) public items: DeleteAllItem[] = [];
    @Output() completed = new EventEmitter<boolean>();


    public isSynchronizing: boolean = false;
    public percentage: number = 0;
    public hasErrors: boolean = false;
    public errors: SynchronizeGrafanaResponse[] = [];

    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);
    @ViewChild('modal') private modal!: ModalComponent;

    private readonly GrafanaUserdashboardsService = inject(GrafanaUserdashboardsService);

    ngOnInit() {
        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
            if (state.show) {
                // Model got opened
                setTimeout(() => {
                    // without the timeout this.items contains old data
                    // ugly hack, but no idea how to fix it
                    this.synchronize();
                }, 250);
            }
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public hideModal() {
        this.isSynchronizing = false;
        this.percentage = 0;
        this.hasErrors = false;
        this.errors = [];
        this.cdr.markForCheck();

        this.modalService.toggle({
            show: false,
            id: 'synchronizeGrafanaModal'
        });
    }

    private synchronize() {
        if (this.items.length === 0) {
            return;
        }

        this.cdr.markForCheck();

        this.isSynchronizing = true;
        this.percentage = 0;
        let count = this.items.length;
        let responseCount: number = 0
        let issueCount: number = 0;

        // Delete any old errors
        this.errors = [];

        for (let i in this.items) {
            const item = this.items[i];

            this.GrafanaUserdashboardsService.synchronizeWithGrafana(Number(item.id)).subscribe({
                next: (value) => {
                    this.cdr.markForCheck();

                    responseCount++
                    this.percentage = Math.round((responseCount / count) * 100);

                    if (value.success === false) {
                        issueCount++
                        this.hasErrors = true;
                        this.errors.push({
                            success: false,
                            message: value.message,
                            _csrfToken: value._csrfToken
                        });
                    }

                    if (responseCount === count && issueCount === 0) {
                        // The timeout is not necessary. It is just to show the progress bar at 100% for a short time.
                        setTimeout(() => {
                            // All records have been synchronized successfully. Reset the modal
                            this.isSynchronizing = false;
                            this.percentage = 0;
                            this.hasErrors = false;
                            this.errors = [];

                            this.hideModal();
                        }, 250);
                        this.completed.emit(true);
                    }

                },
                error: (error: HttpErrorResponse) => {
                    this.cdr.markForCheck();
                    const responseError = error.error as SynchronizeGrafanaResponse;
                    issueCount++
                    this.hasErrors = true;
                    this.errors.push(responseError);

                    responseCount++;
                    this.percentage = Math.round((responseCount / count) * 100);

                    if (responseCount === count && issueCount > 0) {
                        // The timeout is not necessary. It is just to show the progress bar at 100% for a short time.
                        setTimeout(() => {
                            this.isSynchronizing = false;
                            this.percentage = 0;
                        }, 250);
                        this.completed.emit(false);
                    }
                }
            });
        }
    }

}
