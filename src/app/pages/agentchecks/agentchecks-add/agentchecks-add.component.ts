import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { AgentchecksService } from '../agentchecks.service';
import { HistoryService } from '../../../history.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { AgentcheckPost } from '../agentchecks.interface';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckInputDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormsModule } from '@angular/forms';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { NgIf } from '@angular/common';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';

@Component({
    selector: 'oitc-agentchecks-add',
    standalone: true,
    imports: [
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        FormDirective,
        CardComponent,
        CardTitleDirective,
        NavComponent,
        CardHeaderComponent,
        TranslocoDirective,
        NavItemComponent,
        BackButtonDirective,
        CardBodyComponent,
        FormLabelDirective,
        RequiredIconComponent,
        FormControlDirective,
        FormErrorDirective,
        FormsModule,
        FormFeedbackComponent,
        FormCheckInputDirective,
        CardFooterComponent,
        XsButtonDirective,
        LabelLinkComponent,
        NgIf,
        SelectComponent
    ],
    templateUrl: './agentchecks-add.component.html',
    styleUrl: './agentchecks-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentchecksAddComponent implements OnInit, OnDestroy {

    public createAnother: boolean = false;
    public post: AgentcheckPost = this.getDefaultPost();
    public servicetemplates: SelectKeyValue[] = [];
    public errors: GenericValidationError | null = null;

    private subscriptions: Subscription = new Subscription();
    private readonly AgentchecksService = inject(AgentchecksService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.loadServicetemplates();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public getDefaultPost(): AgentcheckPost {
        return {
            name: '',
            plugin_name: '',
            servicetemplate_id: 0
        }
    }

    public loadServicetemplates(): void {
        this.subscriptions.add(this.AgentchecksService.loadServicetemplates().subscribe((servicetemplates) => {
            this.cdr.markForCheck();
            this.servicetemplates = servicetemplates;
        }));
    }

    public submit() {
        this.subscriptions.add(this.AgentchecksService.add(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Agent check');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['agentchecks', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/agentchecks/index']);
                        return;
                    }
                    this.post = this.getDefaultPost();
                    this.notyService.scrollContentDivToTop();
                    this.errors = null;
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
