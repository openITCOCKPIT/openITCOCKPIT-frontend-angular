import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { IsarFlowHostsService } from '../../pages/isarflow-hosts/isar-flow-hosts.service';
import { IsarFlowTabs } from './isar-flow-tabs.enum';
import {
    IsarFlowHostInformationResponse,
    IsarFlowInterfaceInformationResponse
} from '../../pages/isarflow-hosts/isarflow-hosts.interface';
import { NgClass } from '@angular/common';
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
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { BackButtonDirective } from '../../../../directives/back-button.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { SelectComponent } from '../../../../layouts/primeng/select/select/select.component';
import { IframeComponent } from '../../../../components/iframe/iframe.component';
import { IsarFlowTimepickerComponent } from '../isar-flow-timepicker/isar-flow-timepicker.component';
import { IsarFlowTimepickerChange } from '../isar-flow-timepicker.interface';

@Component({
    selector: 'oitc-isar-flow-host-browser-tab',
    imports: [
        TranslocoDirective,
        RowComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        CardBodyComponent,
        SelectComponent,
        NgClass,
        ColComponent,
        IframeComponent,
        IsarFlowTimepickerComponent
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
    public isarFlowInterfaceInformation?: IsarFlowInterfaceInformationResponse;

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

            // Select the first interface
            if (this.interfacesSelect.length > 0) {
                this.interfaceId = this.interfacesSelect[0].key;
                this.loadInterfaceData();
            }

            this.isarflowHost = result;
            this.cdr.markForCheck();
        }));
    }

    public onInterfaceChange() {
        this.loadInterfaceData();
        this.cdr.markForCheck();
    }

    public loadInterfaceData(): void {
        if (this.interfaceId <= 0) {
            return;
        }

        this.subscriptions.add(this.IsarFlowHostsService.loadInterfaceInformation(this.interfaceId, this.duration).subscribe(result => {
            this.isarFlowInterfaceInformation = result;
            this.cdr.markForCheck();
        }));
    }

    public changeTab(tab: IsarFlowTabs): void {
        this.selectedTab = tab;
    }

    public onIsarFlowTimeDurationChange(event: IsarFlowTimepickerChange): void {
        this.duration = event.duration;
        this.loadInterfaceData();
    }

    protected readonly IsarFlowTabs = IsarFlowTabs;
}
