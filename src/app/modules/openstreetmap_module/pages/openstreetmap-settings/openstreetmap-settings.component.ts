import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import { FormLoaderComponent } from '../../../../layouts/primeng/loading/form-loader/form-loader.component';
import {
    CardBodyComponent,
    CardComponent, CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective, RowComponent
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../../components/required-icon/required-icon.component';
import { TrueFalseDirective } from '../../../../directives/true-false.directive';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { OpenstreetmapService } from '../openstreetmap.service';
import { Subscription } from 'rxjs';
import {
    FilterTemplate,
    OpenstreetmapSettings,
    OpenstreetmapSettingsFilter,
    OpenstreetmapRequestSettings
} from '../openstreetmap.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { NotyService } from  '../../../../layouts/coreui/noty.service';
import { FormFeedbackComponent } from '../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormErrorDirective } from '../../../../layouts/coreui/form-error.directive';

@Component({
  selector: 'oitc-openstreetmap-settings',
    imports: [
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        FormLoaderComponent,
        FormDirective,
        FormsModule,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        FormControlDirective,
        FormLabelDirective,
        RequiredIconComponent,
        ColComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        RowComponent,
        TrueFalseDirective,
        CardFooterComponent,
        XsButtonDirective,
        FormFeedbackComponent,
        FormErrorDirective
    ],
  templateUrl: './openstreetmap-settings.component.html',
  styleUrl: './openstreetmap-settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenstreetmapSettingsComponent implements OnInit, OnDestroy  {

    private cdr = inject(ChangeDetectorRef);
    private readonly OpenstreetmapService = inject(OpenstreetmapService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly subscriptions: Subscription = new Subscription();
    protected errors: GenericValidationError | null = null;
    protected post: OpenstreetmapSettingsFilter = {
        id: 1,
        server_url: '',
        reload_interval: 15,
        state_filter: 0,
        filter: {
            up_ok: 1,
            warning: 1,
            down_critical: 1,
            unreachable_unknown: 1
        },
        hide_empty_locations: 1,
        hide_not_monitored_locations: 1,
        highlight_down_ack: 1
    };

    protected filter: FilterTemplate = {
        up_ok: 1,
        warning: 2,
        down_critical: 4,
        unreachable_unknown: 8
    }

    public ngOnInit(): void {
        this.subscriptions.add(
            this.OpenstreetmapService.getSettings().subscribe((settings: OpenstreetmapRequestSettings): void => {
                this.post.id = settings.settings.id;
                this.post.server_url = settings.settings.server_url;
                this.post.reload_interval = settings.settings.reload_interval;
                this.post.state_filter = Number(settings.settings.state_filter);
                this.post.hide_empty_locations = Number(settings.settings.hide_empty_locations);
                this.post.hide_not_monitored_locations = Number(settings.settings.hide_not_monitored_locations);
                this.post.highlight_down_ack = Number(settings.settings.highlight_down_ack);
                this.post.filter.up_ok = this.post.state_filter & this.filter.up_ok;
                this.post.filter.warning = this.post.state_filter & this.filter.warning;
                this.post.filter.down_critical = this.post.state_filter & this.filter.down_critical;
                this.post.filter.unreachable_unknown = this.post.state_filter & this.filter.unreachable_unknown;
                this.cdr.markForCheck();
                }
            )
        );
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    protected updateOpenstreetmapSettings(): void {
        this.errors = null;
        this.post.state_filter = this.post.filter.up_ok |
            this.post.filter.warning |
            this.post.filter.down_critical |
            this.post.filter.unreachable_unknown;
        this.subscriptions.add(
            this.OpenstreetmapService.setOpenstreetmapSettings(this.post).subscribe((result: GenericResponseWrapper): void => {
                    if (result.success) {
                        this.errors = null;
                        this.notyService.genericSuccess();
                        return;
                    }
                    this.errors = result.data as GenericValidationError;
                    this.notyService.genericError();
                this.cdr.markForCheck();
                }
            )
        );
    }
}
