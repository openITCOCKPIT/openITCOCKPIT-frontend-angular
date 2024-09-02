import { Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../ExternalSystems.interface';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { OnlineOfflineComponent } from '../../online-offline/online-offline.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { JsonPipe, NgClass, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { NetworkDeviceComponent } from '../network-device/network-device.component';
import { VirtualMachineComponent } from '../virtual-machine/virtual-machine.component';
import { ServerComponent } from '../server/server.component';
import { DefaultComponent } from '../default/default.component';
import { WanLineComponent } from '../wan-line/wan-line.component';
import { CustomClassComponent } from '../custom-class/custom-class.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../../permissions/permission.directive';
import { DependencyTreeComponent } from '../../../dependency-tree/dependency-tree.component';

@Component({
    selector: 'oitc-itop-overview',
    standalone: true,
    imports: [
        ColComponent,
        OnlineOfflineComponent,
        RowComponent,
        TranslocoDirective,
        NgSwitch,
        NgIf,
        JsonPipe,
        NetworkDeviceComponent,
        VirtualMachineComponent,
        ServerComponent,
        DefaultComponent,
        WanLineComponent,
        CustomClassComponent,
        NgSwitchCase,
        NgSwitchDefault,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        NgClass,
        DependencyTreeComponent
    ],
    templateUrl: './itop-overview.component.html',
    styleUrl: './itop-overview.component.css'
})
export class ItopOverviewComponent {

    @Input() public result!: AdditionalHostInformationResult;
    @Input() public hostId: number = 0;
    @Input() public hostname: string = '';

    public selectedTab: 'information' | 'dependencyTree' = 'information';

    public setSelectedTab(newTab: 'information' | 'dependencyTree'): void {
        this.selectedTab = newTab;
    }
}
