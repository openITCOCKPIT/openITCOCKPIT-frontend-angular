import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormControlDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormsModule } from '@angular/forms';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { DateTime } from 'luxon';
import { GenericValidationError } from '../../../generic-responses';
import { Subscription } from 'rxjs';
import { BackupsService } from '../backups.service';
import { StartBackupResponse } from '../backups.interface';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { NgClass, NgIf } from '@angular/common';
import { OitcAlertComponent } from '../../../components/alert/alert.component';
import { ProgressBar } from 'primeng/progressbar';


@Component({
    selector: 'oitc-backups-index',
    imports: [
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        CardBodyComponent,
        AlertComponent,
        RowComponent,
        ColComponent,
        FormsModule,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        RequiredIconComponent,
        TranslocoPipe,
        CardFooterComponent,
        NgIf,
        OitcAlertComponent,
        NgClass,
        ProgressBar
    ],
    templateUrl: './backups-index.component.html',
    styleUrl: './backups-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackupsIndexComponent implements OnInit, OnDestroy {

    public filename: string = 'mysql_oitc_bkp'
    public filenameDataExample: string = '';
    public backupIsRunning: boolean = false;

    public errors: GenericValidationError | null = null;

    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    private readonly BackupsService: BackupsService = inject(BackupsService);
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);

    private checkIntervalId: any = null;

    public ngOnInit(): void {
        let date = DateTime.now();
        this.filenameDataExample = date.toFormat('_yyyy-MM-dd_HHmmss');
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        if (this.checkIntervalId) {
            clearInterval(this.checkIntervalId);
            this.checkIntervalId = null;
        }
    }

    public startBackup(): void {
        this.subscriptions.add(this.BackupsService.createBackup(this.filename)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {

                    const response = result.data as StartBackupResponse;
                    this.backupIsRunning = response.backup.backupRunning;

                    this.errors = null;

                    // Backup job is running - wait for it to finish
                    this.startCheckInterval();
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

    private startCheckInterval(): void {
        if (this.checkIntervalId) {
            clearInterval(this.checkIntervalId);
            this.checkIntervalId = null;
        }

        this.checkIntervalId = setInterval(() => {
            this.BackupsService.checkBackupFinished().subscribe(data => {
                this.cdr.markForCheck();

                if (data.backupFinished.finished) {
                    this.backupIsRunning = false;
                }

                if (!this.backupIsRunning) {
                    clearInterval(this.checkIntervalId);
                    this.checkIntervalId = null;
                }

                if (!this.backupIsRunning) {
                    if (data.backupFinished.error) {
                        this.notyService.genericError();
                    } else {
                        const msg = this.TranslocoService.translate('Backup created successfully');
                        this.notyService.genericSuccess(msg);
                    }
                }
            });
        }, 1000);
    }

}
