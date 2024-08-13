import { Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../layouts/coreui/coreui.component';
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
        CoreuiComponent,
        TranslocoDirective,
        AlertComponent,
        FaIconComponent,
        NgIf,
        NgForOf,
        NgClass
    ],
  templateUrl: './repository-checker.component.html',
  styleUrl: './repository-checker.component.css'
})
export class RepositoryCheckerComponent implements OnInit, OnDestroy {
    private readonly RepositoryCheckerService: RepositoryCheckerService = inject(RepositoryCheckerService);
    private readonly Subscription: Subscription = new Subscription();
    protected data: RespositoryCheckerResponse | null = null;

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
            }));
    }
}
