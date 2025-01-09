import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
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
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { MkchecksService } from '../mkchecks.service';
import { HistoryService } from '../../../../../history.service';
import { MkcheckPost } from '../mkchecks.interface';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { PaginatorModule } from 'primeng/paginator';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { LabelLinkComponent } from '../../../../../layouts/coreui/label-link/label-link.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'oitc-mkchecks-add',
    imports: [
        TranslocoDirective,
        RouterLink,
        FaIconComponent,
        PermissionDirective,
        CardComponent,
        CardHeaderComponent,
        BackButtonDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        CardTitleDirective,
        CardBodyComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        PaginatorModule,
        RequiredIconComponent,
        LabelLinkComponent,
        SelectComponent,
        CardFooterComponent,
        FormCheckInputDirective,
        FormDirective,
        FormsModule
    ],
    templateUrl: './mkchecks-add.component.html',
    styleUrl: './mkchecks-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MkchecksAddComponent implements OnInit, OnDestroy {

    public createAnother: boolean = false;
    public post: MkcheckPost = this.getDefaultPost();
    public servicetemplates: SelectKeyValue[] = [];
    public errors: GenericValidationError | null = null;

    private subscriptions: Subscription = new Subscription();
    private readonly MkchecksService = inject(MkchecksService);
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

    public getDefaultPost(): MkcheckPost {
        return {
            name: '',
            servicetemplate_id: 0
        }
    }

    public loadServicetemplates(): void {
        this.subscriptions.add(this.MkchecksService.loadServicetemplates().subscribe((servicetemplates) => {
            this.cdr.markForCheck();
            this.servicetemplates = servicetemplates;
        }));
    }

    public submit() {
        this.subscriptions.add(this.MkchecksService.add(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    console.log(response);
                    const title = this.TranslocoService.translate('Checkmk check');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['checkmk_module', 'mkchecks', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/checkmk_module/mkchecks/index']);
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
