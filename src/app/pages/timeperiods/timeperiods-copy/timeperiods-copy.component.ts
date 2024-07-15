import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GenericValidationError } from '../../../generic-responses';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TimeperiodsService } from '../timeperiods.service';
import { TimeperiodCopyPost } from '../timeperiods.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormLabelDirective,
    NavComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-timeperiods-copy',
    standalone: true,
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        NavComponent,
        NgForOf,
        PermissionDirective,
        RequiredIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        FormLoaderComponent,
        NgIf
    ],
    templateUrl: './timeperiods-copy.component.html',
    styleUrl: './timeperiods-copy.component.css'
})
export class TimeperiodsCopyComponent implements OnInit, OnDestroy {

    public timeperiods: TimeperiodCopyPost[] = [];
    public errors: GenericValidationError | null = null;

    private subscriptions: Subscription = new Subscription()
    private TimeperiodsService = inject(TimeperiodsService);
    private readonly notyService = inject(NotyService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    ngOnInit(): void {

        const ids = String(this.route.snapshot.paramMap.get('ids')).split(',').map(Number);
        if (!ids) {
            // No ids given
            this.router.navigate(['/', 'timeperiods', 'index']);
        }

        if (ids) {
            this.subscriptions.add(this.TimeperiodsService.getTimeperiodsCopy(ids).subscribe(timeperiods => {
                for (let timeperiod of timeperiods) {
                    this.timeperiods.push(<TimeperiodCopyPost>{
                        Source: {
                            id: timeperiod.Timeperiod.id,
                            name: timeperiod.Timeperiod.name,
                        },

                        Timeperiod: {
                            name: timeperiod.Timeperiod.name,
                            description: timeperiod.Timeperiod.description,
                        },
                        Error: null
                    })
                }
            }));
        }

    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public copy() {
        const sub = this.TimeperiodsService.saveTimeperiodsCopy(this.timeperiods).subscribe({
            next: (value: any) => {
                //console.log(value); // Serve result with the new copied timeperiods
                // 200 ok
                this.notyService.genericSuccess();
                this.HistoryService.navigateWithFallback(['/', 'timeperiods', 'index']);
            },
            error: (error: HttpErrorResponse) => {
                // We run into a validation error.
                // Some timeperiods maybe already got created. For example when the user copied 3 timeperiods, and the first
                // two timeperiods where copied successfully, but the third one failed due to a validation error.
                //
                // The Server returns everything as the frontend expect it

                this.notyService.genericError();
                this.timeperiods = error.error.result as TimeperiodCopyPost[];
            }
        });

        this.subscriptions.add(sub);
    }


}
