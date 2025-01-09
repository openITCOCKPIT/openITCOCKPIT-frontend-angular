import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AgentcheckPost } from '../agentchecks.interface';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { AgentchecksService } from '../agentchecks.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HistoryService } from '../../../history.service';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardTitleDirective,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
  NavComponent,
  NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'oitc-agentchecks-edit',
    imports: [
    BackButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FaIconComponent,
    FormControlDirective,
    FormDirective,
    FormErrorDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    FormsModule,
    LabelLinkComponent,
    NavComponent,
    NavItemComponent,
    PermissionDirective,
    ReactiveFormsModule,
    RequiredIconComponent,
    SelectComponent,
    TranslocoDirective,
    XsButtonDirective,
    RouterLink,
    FormLoaderComponent,
    NgIf
],
    templateUrl: './agentchecks-edit.component.html',
    styleUrl: './agentchecks-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentchecksEditComponent implements OnInit, OnDestroy {

    public post!: AgentcheckPost;
    public servicetemplates: SelectKeyValue[] = [];
    public errors: GenericValidationError | null = null;

    private subscriptions: Subscription = new Subscription();
    private readonly AgentchecksService = inject(AgentchecksService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly notyService = inject(NotyService);
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.loadServicetemplates();
        this.route.queryParams.subscribe(params => {
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.loadAgentcheck(id);
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadAgentcheck(id: number) {
        this.subscriptions.add(this.AgentchecksService.getAgentcheckEdit(id).subscribe(agentcheck => {
            this.post = agentcheck;
            this.cdr.markForCheck();
        }));
    }

    public loadServicetemplates(): void {
        this.subscriptions.add(this.AgentchecksService.loadServicetemplates().subscribe((servicetemplates) => {
            this.cdr.markForCheck();
            this.servicetemplates = servicetemplates;
        }));
    }

    public submit() {
        this.subscriptions.add(this.AgentchecksService.saveAgentcheckEdit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();

                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Agent check');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['agentchecks', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/agentchecks/index']);
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
