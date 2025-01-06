import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    TableDirective,
    TooltipDirective
} from '@coreui/angular';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { EventcorrelationSettingsPost } from '../eventcorrelation-settings.interface';
import { EventcorrelationSettingsService } from '../eventcorrelation-settings.service';
import { BinaryConfigOptions } from '../configOptions.enum';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { NgIf } from '@angular/common';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';

@Component({
    selector: 'oitc-eventcorrelation-settings-index',
    imports: [
        AlertComponent,
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
        FormsModule,
        PermissionDirective,
        TableDirective,
        TranslocoDirective,
        XsButtonDirective,
        TooltipDirective,
        RouterLink,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormLabelDirective,
        RequiredIconComponent,
        SelectComponent,
        NgIf,
        TrueFalseDirective
    ],
    templateUrl: './eventcorrelation-settings-index.component.html',
    styleUrl: './eventcorrelation-settings-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventcorrelationSettingsIndexComponent implements OnInit, OnDestroy {
    public post!: EventcorrelationSettingsPost;
    public errors: GenericValidationError | null = null;
    private readonly subscriptions: Subscription = new Subscription();
    private EventcorrelationSettingsService = inject(EventcorrelationSettingsService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private cdr = inject(ChangeDetectorRef);

    protected readonly ConnectionLineTypes = [
        {
            key: 'straight',
            value: this.TranslocoService.translate('Straight')
        },
        {
            key: 'segment',
            value: this.TranslocoService.translate('Segment')
        },
        {
            key: 'bezier',
            value: this.TranslocoService.translate('Bezier')
        }
    ];

    protected readonly binaryConfigOptions = [
        {
            key: 'EVC_CONSIDER_STATETYPE',
            value: BinaryConfigOptions.EVC_CONSIDER_STATETYPE
        },
        {
            key: 'EVC_CONSIDER_STATE_COUNT',
            value: BinaryConfigOptions.EVC_CONSIDER_STATE_COUNT
        },
        {
            key: 'EVC_REFLECT_CRITICAL_STATE',
            value: BinaryConfigOptions.EVC_REFLECT_CRITICAL_STATE
        },
        {
            key: 'EVC_SHOW_INFO_FOR_DISABLED_SERVICES',
            value: BinaryConfigOptions.EVC_SHOW_INFO_FOR_DISABLED_SERVICES
        },
        {
            key: 'EVC_ANIMATE_CONNECTIONS',
            value: BinaryConfigOptions.EVC_ANIMATE_CONNECTIONS
        }
    ];

    protected readonly MonitoringSystems = [
        {
            key: 'statusengine',
            value: this.TranslocoService.translate('Statusengine Event Broker (Naemon and Naemon) (Recommend)')
        },
        {
            key: 'naemon',
            value: this.TranslocoService.translate('Query Handler (Naemon only - naemon.qh) (Recommend over nagios.cmd)')
        },
        {
            key: 'nagios',
            value: this.TranslocoService.translate('External commands pipe (Nagios and Nameon - nagios.cmd)')
        }
    ];

    protected readonly StatusForServiceInDowntime = [
        {
            key: -1,
            value: this.TranslocoService.translate('Actual service state')
        },
        {
            key: 0,
            value: this.TranslocoService.translate('Ok')
        },
        {
            key: 1,
            value: this.TranslocoService.translate('Warning')
        },
        {
            key: 2,
            value: this.TranslocoService.translate('Critical')
        },
        {
            key: 3,
            value: this.TranslocoService.translate('Unknown')
        },
    ];

    protected readonly StatusForDisabledService = [
        {
            key: 0,
            value: this.TranslocoService.translate('Ok')
        },
        {
            key: 1,
            value: this.TranslocoService.translate('Warning')
        },
        {
            key: 2,
            value: this.TranslocoService.translate('Critical')
        },
        {
            key: 3,
            value: this.TranslocoService.translate('Unknown')
        },
    ];


    public ngOnInit() {
        this.subscriptions.add(
            this.EventcorrelationSettingsService.getEventcorrelationSettings().subscribe(data => {
                this.post = data;
                this.binaryConfigOptions.forEach((option) => {
                    (this.post as any)[option.key] = (this.post.configuration_option & option.value) > 0;
                });
                this.cdr.markForCheck();
            })
        );
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public submit() {
        this.post.configuration_option = 0;
        this.binaryConfigOptions.forEach((option) => {
            if ((this.post as any)[option.key] === true) {
                this.post.configuration_option += option.value;
            }
        });
        this.subscriptions.add(this.EventcorrelationSettingsService.save(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Data');
                    const msg = this.TranslocoService.translate('saved successfully');
                    this.notyService.genericSuccess(msg, title);
                    return;
                }
                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            })
        );
    }
}
