import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    EventEmitter,
    inject,
    input,
    Input,
    Output
} from '@angular/core';
import {
    ButtonCloseDirective,
    ColComponent,
    FormControlDirective,
    FormLabelDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ProgressComponent,
    RowComponent
} from '@coreui/angular';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { HttpErrorResponse } from '@angular/common/http';
import { FormFeedbackComponent } from '../../../../layouts/coreui/form-feedback/form-feedback.component';
import { GenericValidationError } from '../../../../generic-responses';
import { ResourceEntity, ScmSettings } from '../../pages/resources/resources.interface';
import { ResourcesService } from '../../pages/resources/resources.service';
import { RequiredIconComponent } from '../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../layouts/primeng/select/select/select.component';
import { NotyService } from '../../../../layouts/coreui/noty.service';
import { FormErrorDirective } from '../../../../layouts/coreui/form-error.directive';

@Component({
    selector: 'oitc-resources-set-status-modal',
    imports: [
    ModalComponent,
    TranslocoDirective,
    ButtonCloseDirective,
    FaIconComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ColComponent,
    FormControlDirective,
    ModalBodyComponent,
    ModalFooterComponent,
    ReactiveFormsModule,
    RowComponent,
    XsButtonDirective,
    FormsModule,
    ProgressComponent,
    FormFeedbackComponent,
    NgClass,
    FormLabelDirective,
    RequiredIconComponent,
    SelectComponent,
    FormErrorDirective
],
    templateUrl: './resources-set-status-modal.component.html',
    styleUrl: './resources-set-status-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcesSetStatusModalComponent {
    private readonly modalService = inject(ModalService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected comment: string = '';
    protected status: number | null = null;
    protected isProcessing: boolean = false;
    protected percentage: number = 0;
    protected hasErrors: boolean = false;
    protected errors: GenericValidationError | null = null;
    private ResourcesService = inject(ResourcesService);
    public containNotAssignedObjects: boolean = false;

    itemsInput = input<ResourceEntity[]>([]);
    public items: ResourceEntity[] = [];
    @Input({required: true}) public settings!: ScmSettings;
    @Output() completed = new EventEmitter<boolean>();
    private readonly notyService = inject(NotyService);
    protected responseCount: number = 0;
    protected issueCount: number = 0;

    protected readonly statusTypes = [
        {
            key: 1,
            value: this.TranslocoService.translate('Ok')
        },
        {
            key: 2,
            value: this.TranslocoService.translate('Warning')
        },
        {
            key: 3,
            value: this.TranslocoService.translate('Critical')
        }
    ];

    constructor() {
        effect(() => {
            this.items = this.itemsInput();
            this.status = null;
            this.comment = '';
            let ownObjectsCount = 0;
            this.items.forEach((item) => {
                if (item.my_resource) {
                    ownObjectsCount++;
                }
            });
            this.containNotAssignedObjects = ownObjectsCount !== this.items.length;
            this.cdr.markForCheck();

        });
    }


    protected setStatus(): boolean | void {
        // Iterate all elements of this.items and call this.ResourcesService.annotate
        // with the appropriate arguments for each element.
        this.errors = null;
        this.responseCount = 0;
        this.issueCount = 0;

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

            this.ResourcesService.setStatus(item.id, this.status, this.comment).subscribe({
                next: (value: any) => {
                    this.responseCount++;
                    this.percentage = Math.round((this.responseCount / this.items.length) * 100);

                    if (this.responseCount === this.items.length && this.issueCount === 0) {
                        this.hideModal();
                        this.completed.emit(true);
                    }
                    this.notyService.genericSuccess();
                    this.cdr.markForCheck();
                },
                error: (error: HttpErrorResponse) => {
                    this.cdr.markForCheck();
                    this.responseCount++;
                    this.errors = error.error.error as GenericValidationError
                    this.issueCount++
                    this.hasErrors = true;
                    this.notyService.genericError();
                    if (this.responseCount === this.items.length && this.issueCount > 0) {
                        // The timeout is not necessary. It is just to show the progress bar at 100% for a short time.
                        setTimeout(() => {
                            this.percentage = 0;
                        }, 250);
                        this.completed.emit(false);
                    }
                    if (this.responseCount && this.items.length) {
                        this.isProcessing = false;
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
}
