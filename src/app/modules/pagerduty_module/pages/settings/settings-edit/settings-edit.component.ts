import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../../../layouts/coreui/coreui.component';
import { PagerdutySettingsService } from '../PagerdutySettings.service';
import { Subscription } from 'rxjs';
import { PagerdutySettings } from '../PagerdutySettings.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'oitc-settings-edit',
    standalone: true,
    imports: [
        CoreuiComponent,
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink
    ],
    templateUrl: './settings-edit.component.html',
    styleUrl: './settings-edit.component.css'
})
export class SettingsEditComponent implements OnInit, OnDestroy {
    private readonly pagerdutySettingsService: PagerdutySettingsService = inject(PagerdutySettingsService);
    private readonly subscriptions: Subscription = new Subscription();
    protected settings: PagerdutySettings = {} as PagerdutySettings;

    public ngOnInit(): void {
        this.subscriptions.add(
            this.pagerdutySettingsService.getPagerdutySettings().subscribe((settings: PagerdutySettings): void => {
                    this.settings = settings
                }
            )
        );
    }


    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
