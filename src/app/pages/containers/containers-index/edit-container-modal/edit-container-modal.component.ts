import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnDestroy,
    Output
} from '@angular/core';
import {
    ButtonCloseDirective,
    FormControlDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { RequiredIconComponent } from '../../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ContainersIndexContainer, NodePost } from '../../containers.interface';
import { GenericIdResponse, GenericValidationError } from '../../../../generic-responses';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../layouts/coreui/noty.service';
import { ContainersService } from '../../containers.service';

@Component({
    selector: 'oitc-edit-container-modal',
    standalone: true,
    imports: [
        ButtonCloseDirective,
        FaIconComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        NgIf,
        NgOptionTemplateDirective,
        NgSelectComponent,
        ReactiveFormsModule,
        RequiredIconComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective
    ],
    templateUrl: './edit-container-modal.component.html',
    styleUrl: './edit-container-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditContainerModalComponent implements OnDestroy {

    @Input() public container?: ContainersIndexContainer;
    @Output() completed = new EventEmitter<boolean>();

    public errors: GenericValidationError | null = null;
    public isSaving: boolean = false;

    private subscriptions: Subscription = new Subscription();
    private readonly ContainersService = inject(ContainersService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly modalService = inject(ModalService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public hideModal() {
        this.modalService.toggle({
            show: false,
            id: 'editContainerModal'
        });
    }

    public submit() {
        this.isSaving = true;


        if (this.container) {
            const post: NodePost = {
                id: this.container.id,
                parent_id: this.container.parent_id,
                name: this.container.name,
                containertype_id: this.container.containertype_id,
            }


            this.subscriptions.add(this.ContainersService.edit(post)
                .subscribe((result) => {
                    this.isSaving = false;
                    this.cdr.markForCheck();

                    if (result.success) {
                        const response = result.data as GenericIdResponse;
                        const title = this.TranslocoService.translate('Container');
                        const msg = this.TranslocoService.translate('updated successfully');

                        this.notyService.genericSuccess(msg, title);

                        this.errors = null;
                        this.completed.emit(true);
                        this.hideModal();
                        return;
                    }

                    // Error
                    const errorResponse = result.data as GenericValidationError;
                    this.notyService.genericError();
                    if (result) {
                        this.errors = errorResponse;
                    }
                }));
        }
    }
}
