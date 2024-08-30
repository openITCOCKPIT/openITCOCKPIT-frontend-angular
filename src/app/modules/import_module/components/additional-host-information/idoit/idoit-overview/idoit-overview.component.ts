import { Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../ExternalSystems.interface';
import { TranslocoDirective } from '@jsverse/transloco';
import { BadgeComponent, ColComponent, RowComponent } from '@coreui/angular';
import { HostgroupExtendedTabs } from '../../../../../../pages/hostgroups/hostgroups.enum';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';
import { OnlineOfflineComponent } from '../../online-offline/online-offline.component';

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
        OnlineOfflineComponent
    ],
    templateUrl: './idoit-overview.component.html',
    styleUrl: './idoit-overview.component.css'
})
export class IdoitOverviewComponent {

    @Input() public result!: AdditionalHostInformationResult;

    protected readonly HostgroupExtendedTabs = HostgroupExtendedTabs;
}
