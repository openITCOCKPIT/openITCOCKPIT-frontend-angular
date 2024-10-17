import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { RespositoryCheckerResponse } from './repository-checker.interface';
import { AlertComponent } from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RepositoryCheckerService } from './repository-checker.service';
import { Subscription } from 'rxjs';
import { NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
    selector: 'oitc-repository-checker',
    standalone: true,
    imports: [

        TranslocoDirective,
        AlertComponent,
        FaIconComponent,
        NgIf,
        NgForOf,
        NgClass
    ],
    templateUrl: './repository-checker.component.html',
    styleUrl: './repository-checker.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepositoryCheckerComponent implements OnInit, OnDestroy {
    private readonly RepositoryCheckerService: RepositoryCheckerService = inject(RepositoryCheckerService);
    private readonly Subscription: Subscription = new Subscription();
    protected data: RespositoryCheckerResponse | null = null;

    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.getRepositoryCheckerData();
    }

    public ngOnDestroy(): void {
        this.Subscription.unsubscribe();
    }

    public getRepositoryCheckerData(): void {
        this.Subscription.add(
            this.RepositoryCheckerService.getRepositoryCheckerData().subscribe((data: RespositoryCheckerResponse): void => {
                this.data = data;
                this.cdr.markForCheck();
            }));
    }
}
