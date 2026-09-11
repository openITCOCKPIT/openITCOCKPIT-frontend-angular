import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    TableDirective
} from '@coreui/angular';

import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { GenericValidationError } from '../../../../../generic-responses';
import { AiAuditLogService } from '../ai-audit-log.service';
import { AiAuditLogEntry } from '../ai-audit-log.interface';
import { PermissionDirective } from '../../../../../permissions/permission.directive';

/**
 * What the assistant did, per acting person.
 *
 * Read only: an audit that can be edited from the interface it audits is not
 * one. It also carries no conversation text - only the actions.
 */
@Component({
    selector: 'oitc-ai-audit-log-index',
    imports: [
        FormsModule,
        NgClass,
        RouterLink,
        TranslocoDirective,
        PermissionDirective,
        FaIconComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        NoRecordsComponent,
        TableLoaderComponent,
        TableDirective
    ],
    templateUrl: './ai-audit-log-index.component.html',
    styleUrl: './ai-audit-log-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiAuditLogIndexComponent implements OnInit, OnDestroy {

    public entries: AiAuditLogEntry[] = [];
    public isLoading: boolean = true;

    private readonly AiAuditLogService = inject(AiAuditLogService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly subscriptions: Subscription = new Subscription();

    public ngOnInit(): void {
        this.subscriptions.add(this.AiAuditLogService.getIndex({angular: true}).subscribe(result => {
            this.entries = result.all_entries;
            this.isLoading = false;
            this.cdr.markForCheck();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public trackById(index: number, entry: AiAuditLogEntry): number {
        return entry.id;
    }
}
