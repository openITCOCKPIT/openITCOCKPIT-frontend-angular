import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { SlaSettingsService } from '../sla-settings.service';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { SlaSettingsIndexRoot, SlaSettingsPost } from '../SlaSettings.interface';
import { HistoryService } from '../../../../../history.service';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  AlertComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardTitleDirective,
  FormControlDirective,
  FormDirective,
  TableDirective,
  TooltipDirective
} from '@coreui/angular';



import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';



import { PermissionDirective } from '../../../../../permissions/permission.directive';


@Component({
    selector: 'oitc-sla-settings-index',
    imports: [
    TranslocoDirective,
    XsButtonDirective,
    RouterLink,
    FaIconComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    CardBodyComponent,
    FormErrorDirective,
    FormFeedbackComponent,
    FormsModule,
    FormDirective,
    FormControlDirective,
    CardFooterComponent,
    PermissionDirective,
    AlertComponent,
    TableDirective,
    TooltipDirective
],
    templateUrl: './sla-settings-index.component.html',
    styleUrl: './sla-settings-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlaSettingsIndexComponent implements OnInit, OnDestroy {

    private readonly SlaSettingsService: SlaSettingsService = inject(SlaSettingsService);
    private readonly TranslocoService = inject(TranslocoService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    private subscriptions: Subscription = new Subscription();

    public readonly route = inject(ActivatedRoute);
    public errors: GenericValidationError | null = null;
    public post: SlaSettingsPost = {} as SlaSettingsPost;

    private cdr = inject(ChangeDetectorRef);

    constructor() {
        this.post = this.getDefaultPost();
    }

    private getDefaultPost(): SlaSettingsPost {
        return {
            max_age: 53
        };
    }

    public ngOnInit() {
        this.load();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public submit(): void {
        this.subscriptions.add(this.SlaSettingsService.submit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Data');
                    const msg = this.TranslocoService.translate('saved successfully');

                    this.notyService.genericSuccess(msg, title);

                    this.HistoryService.navigateWithFallback(['/sla_module/sla_settings/index']);
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;

                }
            }))
    }

    private load(): void {
        this.subscriptions.add(this.SlaSettingsService.loadSlaSettings()
            .subscribe((result: SlaSettingsIndexRoot) => {
                this.post = result.sla_settings;
                this.cdr.markForCheck();
            }))
    }
}
