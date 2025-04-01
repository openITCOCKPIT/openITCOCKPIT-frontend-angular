import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import {
    FaIconComponent,
} from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import {
    AlertComponent, CardBodyComponent,
    CardComponent, CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, FormControlDirective,
    FormDirective,
    TableDirective, TooltipDirective
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, KeyValuePipe } from '@angular/common';
import {
    DefaultAutoreportSettings,
    AllAutoreportSettings,
    AutoreportSettingsRoot
} from '../autoreport-settings.interface';
import { Subscription } from 'rxjs';
import { AutoreportSettingsService } from '../autoreport-settings.service';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';

@Component({
    selector: 'oitc-autoreport-settings-index',
    imports: [
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        AlertComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        FormDirective,
        FormsModule,
        NgIf,
        NgFor,
        TableDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        TrueFalseDirective,
        FormControlDirective,
        TooltipDirective,
        CardFooterComponent,
        XsButtonDirective,
        DebounceDirective,
        FormFeedbackComponent,
        FormErrorDirective
    ],
    templateUrl: './autoreport-settings-index.component.html',
    styleUrl: './autoreport-settings-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoreportSettingsIndexComponent implements OnInit, OnDestroy {

    private cdr = inject(ChangeDetectorRef);
    private subscriptions: Subscription = new Subscription();
    private AutoreportSettingsService = inject(AutoreportSettingsService);
    private readonly notyService: NotyService = inject(NotyService);
    protected post!: AllAutoreportSettings;
    protected defaultAutoreportSettings!: DefaultAutoreportSettings[];
    protected selected: boolean[] = [];
    protected init: boolean = false;
    protected errors: GenericValidationError | null = null;

    public ngOnInit(): void {

        this.subscriptions.add(this.AutoreportSettingsService.getSettingsIndex().subscribe(data => {
            this.post = data.all_autoreport_settings;
            this.defaultAutoreportSettings = data.default_autoreport_settings;
            let selected: boolean[] = [];
            this.defaultAutoreportSettings.map((item) => {
                selected.push(this.hasBitValue(item.value.value));
            });
            this.selected = selected;
            this.init = true;
            this.cdr.markForCheck();
        }));
    }

    protected hasBitValue(value: number | string) {
        const type = typeof value;
        if (type === 'number') {
            const val = Number(value);
            return Boolean(this.post.configuration_option & val);
        }
        return false;
    };

    public setBitValueForOption(event: boolean, value: number | string) {
        const type = typeof value;
        if (type === 'number') {
            const val = Number(value);
            if (event) {
                this.post.configuration_option |= val;
            } else {
                this.post.configuration_option ^= ~(~val);
            }
        }

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public submitAutoreportSettings() {
        this.errors = null;
        this.AutoreportSettingsService.setSettingsIndex(this.post).subscribe((result: GenericResponseWrapper): void => {
                if (result.success) {
                    this.errors = null;
                    this.notyService.genericSuccess();
                    return;
                }
                this.errors = result.data as GenericValidationError;
                this.notyService.genericError();
                this.cdr.markForCheck();
            }
        );
    }

}
