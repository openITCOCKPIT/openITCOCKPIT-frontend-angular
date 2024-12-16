import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormLabelDirective
} from '@coreui/angular';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { WizardsService } from '../wizards.service';
import { WizardAssignments, WizardGetAssignments } from '../wizards.interface';
import { HistoryService } from '../../../history.service';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';

@Component({
    selector: 'oitc-wizards-edit',
    standalone: true,
    imports: [
        TranslocoDirective,
        RouterLink,
        FaIconComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        RequiredIconComponent,
        FormLabelDirective,
        MultiSelectComponent,
        FormErrorDirective,
        FormFeedbackComponent
    ],
    templateUrl: './wizards-edit.component.html',
    styleUrl: './wizards-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardsEditComponent implements OnDestroy, OnInit {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly WizardsService: WizardsService = inject(WizardsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly route = inject(ActivatedRoute);
    private readonly cdr = inject(ChangeDetectorRef);

    protected post: WizardAssignments = {
        servicetemplates: {
            _ids: [] as number[]
        }
    } as WizardAssignments;
    protected serviceTemplates: SelectKeyValue[] = [];
    protected errors: GenericValidationError = {} as GenericValidationError;


    public submit(): void {
        this.subscriptions.add(this.WizardsService.setAssignments(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const title: string = this.TranslocoService.translate('User');
                    const msg: string = this.TranslocoService.translate('updated successfully');
                    const url: (string | number)[] = ['wizards', 'edit'];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/wizards/assignments']);
                    return;
                }
                // Error
                this.notyService.genericError();
                const errorResponse: GenericValidationError = result.data as GenericValidationError;
                if (result) {
                    this.errors = errorResponse;

                    console.warn(this.errors);
                }
            })
        );
    }

    public ngOnInit() {
        const uuid = String(this.route.snapshot.paramMap.get('uuid'));
        this.subscriptions.add(this.WizardsService.getAssignments(uuid)
            .subscribe((result: WizardGetAssignments) => {
                this.cdr.markForCheck();
                this.serviceTemplates = result.servicetemplates;
                this.post = {
                    uuid: uuid,
                    servicetemplates: {
                        _ids: result.wizardAssignments.servicetemplates._ids
                    }
                } as WizardAssignments;
                console.warn(result.wizardAssignments.servicetemplates._ids);
                console.warn(this.post);
                this.cdr.markForCheck();
            }));

    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}

