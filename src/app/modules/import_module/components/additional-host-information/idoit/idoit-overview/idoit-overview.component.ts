import { Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../ExternalSystems.interface';
import { TranslocoDirective } from '@jsverse/transloco';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { HostgroupExtendedTabs } from '../../../../../../pages/hostgroups/hostgroups.enum';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { OnlineOfflineComponent } from '../../online-offline/online-offline.component';
import { PermissionDirective } from '../../../../../../permissions/permission.directive';
import { IdoitStatus } from '../idoit.enum';
import { HostBrowserTabs } from '../../../../../../pages/hosts/hosts.enum';

@Component({
    selector: 'oitc-idoit-overview',
    standalone: true,
    imports: [
        TranslocoDirective,
        ColComponent,
        RowComponent,
        BadgeComponent,
        FaIconComponent,
        NgIf,
        OnlineOfflineComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        CardBodyComponent,
        TableDirective,
        NgForOf
    ],
    templateUrl: './idoit-overview.component.html',
    styleUrl: './idoit-overview.component.css'
})
export class IdoitOverviewComponent {

    @Input() public result!: AdditionalHostInformationResult;

    protected readonly HostgroupExtendedTabs = HostgroupExtendedTabs;
    protected readonly IdoitStatus = IdoitStatus;
    protected readonly HostBrowserTabs = HostBrowserTabs;
}
