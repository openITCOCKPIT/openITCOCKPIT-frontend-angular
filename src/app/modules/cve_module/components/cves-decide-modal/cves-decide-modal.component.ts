import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    EventEmitter,
    inject,
    input,
    OnDestroy,
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
    RowComponent
} from '@coreui/angular';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Subscription } from 'rxjs';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormFeedbackComponent } from '../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormErrorDirective } from '../../../../layouts/coreui/form-error.directive';
import { RequiredIconComponent } from '../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../layouts/primeng/select/select/select.component';
import { NotyService } from '../../../../layouts/coreui/noty.service';
import { GenericValidationError } from '../../../../generic-responses';
import { CvesService } from '../../pages/cves/cves.service';
import { CveDecision, CveDecisionPost } from '../../pages/cves/cves.interface';
import { CveDecisionStates } from '../../pages/cves/cves.enum';

export type CvesDecideModalMode = 'decide' | 'remove';

// Default review date of a new decision, a decision should never be valid forever
const DEFAULT_REVIEW_DAYS = 90;

/**
 * Decides on one or many findings at once (all or nothing), or ends their decision.
 * Open it with ModalService.toggle({show: true, id: 'cvesDecideModal'}).
 */
@Component({
    selector: 'oitc-cves-decide-modal',
    imports: [
        ModalComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        ModalBodyComponent,
        ModalFooterComponent,
        ButtonCloseDirective,
        RowComponent,
        ColComponent,
        FormControlDirective,
        FormLabelDirective,
        FormsModule,
        TranslocoDirective,
        FaIconComponent,
        XsButtonDirective,
        FormFeedbackComponent,
        FormErrorDirective,
        RequiredIconComponent,
        SelectComponent
    ],
    templateUrl: './cves-decide-modal.component.html',
    styleUrl: './cves-decide-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvesDecideModalComponent implements OnDestroy {
    public findingIds = input<number[]>([]);
    public mode = input<CvesDecideModalMode>('decide');
    // Existing decision to edit, only for a single finding
    public decision = input<CveDecision | null>(null);

    @Output() completed = new EventEmitter<boolean>();

    private readonly modalService = inject(ModalService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly CvesService = inject(CvesService);
    private readonly notyService = inject(NotyService);
    private readonly cdr = inject(ChangeDetectorRef);
    private subscriptions: Subscription = new Subscription();

    protected readonly CveDecisionStates = CveDecisionStates;

    protected post: CveDecisionPost = this.getDefaultPost();
    protected errors: GenericValidationError | null = null;
    protected isProcessing: boolean = false;

    protected readonly states = [
        {
            key: CveDecisionStates.InProgress,
            value: this.TranslocoService.translate('In progress')
        },
        {
            key: CveDecisionStates.Accepted,
            value: this.TranslocoService.translate('Risk accepted')
        },
        {
            key: CveDecisionStates.NotAffected,
            value: this.TranslocoService.translate('Not affected')
        }
    ];

    public constructor() {
        effect(() => {
            // Every new selection starts with an empty form, or with the decision that gets edited
            this.findingIds();
            const decision = this.decision();
            this.post = this.getDefaultPost();
            if (decision) {
                this.post = {
                    state: decision.state,
                    owner: decision.owner,
                    reason: decision.reason,
                    review_after: decision.review_after,
                    evidence_url: decision.evidence_url ?? ''
                };
            }
            this.errors = null;
            this.cdr.markForCheck();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private getDefaultPost(): CveDecisionPost {
        const reviewAfter = new Date();
        reviewAfter.setDate(reviewAfter.getDate() + DEFAULT_REVIEW_DAYS);
        return {
            state: null,
            owner: '',
            reason: '',
            review_after: formatDate(reviewAfter, 'yyyy-MM-dd', 'en-US'),
            evidence_url: ''
        };
    }

    protected submit(): void {
        if (this.findingIds().length === 0) {
            return;
        }
        this.isProcessing = true;
        this.errors = null;

        if (this.mode() === 'remove') {
            this.subscriptions.add(this.CvesService.removeDecision(this.findingIds()).subscribe({
                next: () => {
                    this.notyService.genericSuccess();
                    this.finish(true);
                },
                error: () => {
                    this.notyService.genericError();
                    this.isProcessing = false;
                    this.cdr.markForCheck();
                }
            }));
            return;
        }

        this.subscriptions.add(this.CvesService.decide(this.findingIds(), this.post).subscribe((result) => {
            if (result.success) {
                this.notyService.genericSuccess();
                this.finish(true);
                return;
            }

            // The same input for all findings, so the errors belong to the fields of the form
            this.errors = result.data as GenericValidationError;
            this.notyService.genericError();
            this.isProcessing = false;
            this.cdr.markForCheck();
        }));
    }

    private finish(success: boolean): void {
        this.isProcessing = false;
        this.hideModal();
        this.completed.emit(success);
        this.cdr.markForCheck();
    }

    protected hideModal(): void {
        this.modalService.toggle({
            show: false,
            id: 'cvesDecideModal'
        });
    }
}
