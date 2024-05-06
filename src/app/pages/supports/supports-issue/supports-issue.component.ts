import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    RowComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SupportsService } from '../supports.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'oitc-supports-issue',
    standalone: true,
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        RowComponent,
        ColComponent,
        NgIf
    ],
    templateUrl: './supports-issue.component.html',
    styleUrl: './supports-issue.component.css'
})
export class SupportsIssueComponent implements OnInit, OnDestroy {

    public hasLicense: boolean = false;

    private SupportsService = inject(SupportsService);
    private readonly subscriptions: Subscription = new Subscription();


    public ngOnInit(): void {
        this.subscriptions.add(this.SupportsService.getHasLicense().subscribe(result => {
            this.hasLicense = result;
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
