import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormDirective, FormLabelDirective,
    RowComponent
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { Subscription } from 'rxjs';
import { AutoreportsService } from '../autoreports.service';
import {
    AutoreportPost
} from '../autoreports.interface';
import { InstantreportPost } from '../../../../../pages/instantreports/instantreports.interface';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { NgIf } from '@angular/common';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { GenericValidationError } from '../../../../../generic-responses';

@Component({
  selector: 'oitc-autoreport-add-step-one',
    imports: [
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FormDirective,
        FormsModule,
        CardBodyComponent,
        TranslocoPipe,
        BadgeComponent,
        RowComponent,
        ColComponent,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        NgIf,
        RequiredIconComponent,
        SelectComponent
    ],
  templateUrl: './autoreport-add-step-one.component.html',
  styleUrl: './autoreport-add-step-one.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoreportAddStepOneComponent implements OnInit, OnDestroy {

    private cdr = inject(ChangeDetectorRef);
    private subscriptions: Subscription = new Subscription();
    private readonly AutoreportsService: AutoreportsService = inject(AutoreportsService);

    public errors: GenericValidationError | null = null;
    public containers: SelectKeyValue[] = [];
    public post: AutoreportPost = this.getDefaultPost();


    public ngOnInit(): void {
        this.loadContainers();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private loadContainers() {
        this.subscriptions.add(this.AutoreportsService.loadContainers().subscribe((result) => {
            this.containers = result;
            this.cdr.markForCheck();
        }));
    }

    public onContainerChange() {

    }

    private getDefaultPost(): AutoreportPost {
        return {
            Autoreport: {
                container_id: 0,
                name: '',
                description: '',
                use_start_time: 0,
                report_start_date: '',
                timeperiod_id: 0,
                report_interval: '',
                report_send_interval: '',
                min_availability_percent: false,
                min_availability: '',
                max_number_of_outages: 0,
                show_time: 0, //SLA Graph - if true -> show availability in hours
                check_hard_state: 0, // if true -> consider only hard states from state history
                consider_downtimes: 0,
                consider_holidays: 0,
                calendar_id: null,
                users: {
                    _ids: []
                }
            }
        };
    }
}
