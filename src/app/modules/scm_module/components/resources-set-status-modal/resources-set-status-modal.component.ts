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
    FormControlDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ProgressComponent,
    RowComponent
} from '@coreui/angular';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass, NgForOf, NgTemplateOutlet } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { HttpErrorResponse } from '@angular/common/http';
import { FormFeedbackComponent } from '../../../../layouts/coreui/form-feedback/form-feedback.component';
import { GenericValidationError } from '../../../../generic-responses';
import { Subscription } from 'rxjs';
import { Resource } from '../../pages/resources/resources.interface';
import { ResourcesService } from '../../pages/resources/resources.service';
import { ROOT_CONTAINER } from '../../../../pages/changelogs/object-types.enum';
import { OitcAlertComponent } from '../../../../components/alert/alert.component';

@Component({
    selector: 'oitc-resources-set-status-modal',
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
        ProgressComponent,
        FormFeedbackComponent,
        NgClass
    ],
    templateUrl: './resources-set-status-modal.component.html',
    styleUrl: './resources-set-status-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcesSetStatusModalComponent implements OnInit {
    private readonly modalService = inject(ModalService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected comment: string = '';
    protected status: number | null = null;
    protected isProcessing: boolean = false;
    protected percentage: number = 0;
    protected hasErrors: boolean = false;
    protected errors: GenericValidationError | null = null;
    private ResourcesService = inject(ResourcesService);


    @Input({required: true}) public items: Resource[] = [];
    @Output() completed = new EventEmitter<boolean>();

    constructor() {
    }

    public ngOnInit(): void {
        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
            if (state.id === 'resourcesSetStatusModal' && state.show === true) {
                this.cdr.markForCheck();
            }
        }));
    }


    protected setStatus(): boolean | void {
        // Iterate all elements of this.items and call this.CustomAlertsService.annotate
        // with the appropriate arguments for each element.
        this.errors = null;

        if (this.status === null) {
            this.errors = {
                status: {
                    _empty: this.TranslocoService.translate('This field cannot be left empty')
                }
            };
            return false;
        } else if (this.status > 1 && (this.comment === '' || this.comment === null)) {
            this.errors = {
                comment: {
                    _empty: this.TranslocoService.translate('This field cannot be left empty')
                }
            };
            return false;
        }
        this.isProcessing = true;
        for (let i in this.items) {
            const item = this.items[i];
            let responseCount = 0;
            let count = this.items.length;
            let issueCount = 0;


            this.ResourcesService.setStatus(item.id, this.status, this.comment).subscribe({
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
            id: 'resourcesSetStatusModal'
        });
        this.reset();
    }

    private reset(): void {
        this.isProcessing = false;
        this.percentage = 0;
        this.hasErrors = false;
        this.comment = '';
        this.errors = null;
        this.items = [];
    }

    protected readonly ROOT_CONTAINER = ROOT_CONTAINER;
}
