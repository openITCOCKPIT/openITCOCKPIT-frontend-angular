import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective
} from '@coreui/angular';

import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { AiConfirmationsService } from '../ai-confirmations.service';
import { AiPendingConfirmationRow } from '../ai-confirmations.interface';
import { PermissionDirective } from '../../../../../permissions/permission.directive';

/**
 * Everything waiting on this person.
 *
 * A conversation is a private thing, so this only ever lists approvals from
 * your own conversations - an administrator reads someone else's in the audit
 * log rather than deciding it for them.
 */
@Component({
    selector: 'oitc-ai-confirmations-index',
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
        XsButtonDirective
    ],
    templateUrl: './ai-confirmations-index.component.html',
    styleUrl: './ai-confirmations-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiConfirmationsIndexComponent implements OnInit, OnDestroy {

    public confirmations: AiPendingConfirmationRow[] = [];
    public mayConfirm: boolean = false;
    public comments: { [id: number]: string } = {};

    private readonly AiConfirmationsService = inject(AiConfirmationsService);
    private readonly notyService = inject(NotyService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly subscriptions: Subscription = new Subscription();

    public ngOnInit(): void {
        this.load();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load(): void {
        this.subscriptions.add(this.AiConfirmationsService.getIndex().subscribe(result => {
            this.confirmations = result.pending_confirmations;
            this.mayConfirm = result.may_confirm;
            this.cdr.markForCheck();
        }));
    }

    public decide(confirmation: AiPendingConfirmationRow, approve: boolean): void {
        const comment = this.comments[confirmation.id] || '';
        const request = approve
            ? this.AiConfirmationsService.confirm(confirmation.id, comment)
            : this.AiConfirmationsService.decline(confirmation.id, comment);

        this.subscriptions.add(request.subscribe({
            next: () => {
                this.notyService.genericSuccess();
                this.load();
            },
            error: () => this.notyService.genericError()
        }));
    }

    public trackById(index: number, row: AiPendingConfirmationRow): number {
        return row.id;
    }
}
