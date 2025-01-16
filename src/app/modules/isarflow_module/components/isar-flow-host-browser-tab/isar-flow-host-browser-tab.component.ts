import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { IsarFlowHostsService } from '../../pages/isarflow-hosts/isar-flow-hosts.service';
import { IsarFlowTabs } from './isar-flow-tabs.enum';
import { IsarFlowHostInformationResponse } from '../../pages/isarflow-hosts/isarflow-hosts.interface';
import { NgClass, NgIf } from '@angular/common';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { BackButtonDirective } from '../../../../directives/back-button.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { SelectComponent } from '../../../../layouts/primeng/select/select/select.component';

@Component({
    selector: 'oitc-isar-flow-host-browser-tab',
    imports: [
        NgIf,
        TranslocoDirective,
        RowComponent,
        BackButtonDirective,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        CardBodyComponent,
        SelectComponent,
        NgClass
    ],
    templateUrl: './isar-flow-host-browser-tab.component.html',
    styleUrl: './isar-flow-host-browser-tab.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsarFlowHostBrowserTabComponent implements OnDestroy {

    hostId = input<number>(0);
    lastUpdated = input<Date>(); // Change the date to trigger an update from an external component
    allowEdit = input<boolean>(false);

    public isarflowHost?: IsarFlowHostInformationResponse;
    public duration: number = 3600 * 24;
    public interfaceId: number = 0;
    public selectedTab: IsarFlowTabs = IsarFlowTabs.TopProtocols;
    public interfacesSelect: SelectKeyValue[] = [];

    private subscriptions: Subscription = new Subscription();
    private readonly IsarFlowHostsService = inject(IsarFlowHostsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService)

    private cdr = inject(ChangeDetectorRef);

    constructor() {
        effect(() => {
            if (this.hostId() > 0) {
                this.load();
                return;
            }

            if (this.lastUpdated()) {
                this.load();
                return;
            }
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load(): void {
        this.subscriptions.add(this.IsarFlowHostsService.getIsarFlowHostInformation(this.hostId()).subscribe(result => {
            this.interfacesSelect = result.isarflowHost.isarflow_interfaces.map(iface => {
                return {
                    key: iface.id,
                    value: iface.interface_name
                }
            });
            this.isarflowHost = result;
            this.cdr.markForCheck();
        }));
    }

    public changeTab(tab: IsarFlowTabs): void {
        this.selectedTab = tab;
    }


    protected readonly IsarFlowTabs = IsarFlowTabs;
}
