import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import {
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormLabelDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { OitcAlertComponent } from '../../../components/alert/alert.component';
import { ProgressBar } from 'primeng/progressbar';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectKeyValueString } from '../../../layouts/primeng/select.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { BackupIndexResponse, StartRestoreBackupResponse } from '../backups.interface';
import { BackupsService } from '../backups.service';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import {
    ReloadInterfaceModalComponent
} from '../../../layouts/coreui/reload-interface-modal/reload-interface-modal.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';

@Component({
    selector: 'oitc-backups-restore',
    imports: [
    FaIconComponent,
    PermissionDirective,
    TranslocoDirective,
    RouterLink,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    NavComponent,
    NavItemComponent,
    XsButtonDirective,
    CardBodyComponent,
    AlertComponent,
    CardFooterComponent,
    ColComponent,
    FormLabelDirective,
    FormsModule,
    OitcAlertComponent,
    ProgressBar,
    RequiredIconComponent,
    RowComponent,
    NgClass,
    DeleteAllModalComponent,
    ReloadInterfaceModalComponent,
    SelectComponent
],
    templateUrl: './backups-restore.component.html',
    styleUrl: './backups-restore.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: BackupsService} // Inject the BackupsService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackupsRestoreComponent implements OnInit, OnDestroy {

    public backupFiles: SelectKeyValueString[] = [];
    public restoreIsRunning: boolean = false;
    public selectedBackup: string = '';

    // Used for the delete all modal
    public selectedItems: any[] = [];

    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    private readonly BackupsService: BackupsService = inject(BackupsService);
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly modalService = inject(ModalService);


    private checkIntervalId: any = null;

    public ngOnInit(): void {
        this.loadBackups();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        if (this.checkIntervalId) {
            clearInterval(this.checkIntervalId);
            this.checkIntervalId = null;
        }
    }

    public loadBackups(): void {
        this.subscriptions.add(this.BackupsService.getAvailableBackups()
            .subscribe((result: BackupIndexResponse) => {
                this.backupFiles = [];
                for (let key in result.backup_files) {
                    this.backupFiles.push({
                        key: key, // Path to backup on disk
                        value: result.backup_files[key] // Filename
                    });
                }

                this.cdr.markForCheck();
            })
        );
    }

    public startRestore(): void {
        this.subscriptions.add(this.BackupsService.restoreBackup(this.selectedBackup)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {

                    const response = result.data as StartRestoreBackupResponse;
                    this.restoreIsRunning = response.backup.backupRunning;

                    // Restore job is running - wait for it to finish
                    this.startCheckInterval();
                    return;
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
                    // Restore job is finished
                    this.restoreIsRunning = false;
                }

                if (!this.restoreIsRunning) {
                    clearInterval(this.checkIntervalId);
                    this.checkIntervalId = null;
                }

                if (!this.restoreIsRunning) {
                    if (data.backupFinished.error) {
                        this.notyService.genericError();
                    } else {
                        const msg = this.TranslocoService.translate('Backup restored successfully');
                        this.notyService.genericSuccess(msg);

                        // open modal page reload modal
                        this.modalService.toggle({
                            show: true,
                            id: 'reloadInterfaceModal',
                        });
                    }
                }
            });
        }, 1000);
    }

    public downloadBackup(): void {
        if (this.selectedBackup !== '') {
            this.backupFiles.forEach((backup) => {
                if (backup.key === this.selectedBackup) {
                    const filename = backup.value;

                    window.open(`/backups/downloadBackupFile?filename=${filename}`, '_blank');
                    window.focus();
                }
            });
        }
    }

    public toggleDeleteAllModal(): void {
        let filename = this.selectedBackup; // containers file name with path

        // Find the short file name
        this.backupFiles.forEach((backup) => {
            if (backup.key === this.selectedBackup) {
                filename = backup.value;
            }
        });

        let items: DeleteAllItem[] = [{
            id: this.selectedBackup,
            displayName: filename
        }];

        // Pass selection to the modal
        this.selectedItems = items;
        // open modal
        this.modalService.toggle({
            show: true,
            id: 'deleteAllModal',
        });
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    // We do not really make mass changes as we only delete one backup at a time
    // but to be consistent with the other components, we keep the name
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.selectedBackup = '';
            this.loadBackups();
        }
    }

}
