import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { MkchecksService } from '../mkchecks.service';
import { HistoryService } from '../../../../../history.service';
import { MkcheckPost } from '../mkchecks.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
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
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { PaginatorModule } from 'primeng/paginator';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { LabelLinkComponent } from '../../../../../layouts/coreui/label-link/label-link.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'oitc-mkchecks-edit',
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
        FormDirective,
        FormLoaderComponent,
        FormsModule
    ],
    templateUrl: './mkchecks-edit.component.html',
    styleUrl: './mkchecks-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MkchecksEditComponent implements OnInit, OnDestroy {

    public createAnother: boolean = false;
    public post!: MkcheckPost;
    public servicetemplates: SelectKeyValue[] = [];
    public errors: GenericValidationError | null = null;

    private subscriptions: Subscription = new Subscription();
    private readonly MkchecksService = inject(MkchecksService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.loadServicetemplates();
        this.route.queryParams.subscribe(params => {
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.loadMkcheck(id);
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadMkcheck(id: number) {
        this.subscriptions.add(this.MkchecksService.getMkcheckEdit(id).subscribe(mkcheck => {
            this.post = mkcheck;
            this.cdr.markForCheck();
        }));
    }

    public loadServicetemplates(): void {
        this.subscriptions.add(this.MkchecksService.loadServicetemplates().subscribe((servicetemplates) => {
            this.cdr.markForCheck();
            this.servicetemplates = servicetemplates;
        }));
    }

    public submit() {
        this.subscriptions.add(this.MkchecksService.saveMkcheckEdit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();

                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Checkmk check');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['checkmk_module', 'mkchecks', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/checkmk_module/mkchecks/index']);
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
