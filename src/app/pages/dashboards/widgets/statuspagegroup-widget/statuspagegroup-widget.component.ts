import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    signal,
    ViewChild
} from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { AnimationEvent } from '@angular/animations';
import { ColComponent, FormLabelDirective, RowComponent } from '@coreui/angular';
import { SelectComponent } from '../../../../layouts/primeng/select/select/select.component';
import { RequiredIconComponent } from '../../../../components/required-icon/required-icon.component';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    StatuspagegroupsLoadStatuspagegroupsByStringParams,
    StatuspagegroupWidgetConfig
} from './statuspagegroup-widget.interface';
import { StatuspagegroupWidgetService } from './statuspagegroup-widget.service';
import { StatuspagegroupsService } from '../../../statuspagegroups/statuspagegroups.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';
import {
    StatuspagegroupsViewerComponent
} from '../../../statuspagegroups/statuspagegroups-viewer/statuspagegroups-viewer.component';
import { IntervalPickerComponent } from '../../../../components/interval-picker/interval-picker.component';
import { StatupagegroupViewDetailsRoot } from '../../../statuspagegroups/statuspagegroups.interface';

@Component({
    selector: 'oitc-statuspagegroup-widget',
    imports: [
        FormLabelDirective,
        SelectComponent,
        RequiredIconComponent,
        XsButtonDirective,
        FaIconComponent,
        TranslocoDirective,
        FormsModule,
        ColComponent,
        RowComponent,
        StatuspagegroupsViewerComponent,
        IntervalPickerComponent
    ],
    templateUrl: './statuspagegroup-widget.component.html',
    styleUrl: './statuspagegroup-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatuspagegroupWidgetComponent extends BaseWidgetComponent implements AfterViewInit {
    protected flipped = signal<boolean>(false);
    @ViewChild('boxContainer') boxContainer?: ElementRef;
    public widgetHeight: number = 0;

    // widget config will be loaded from the server
    public config?: StatuspagegroupWidgetConfig;

    public statuspagegroups: SelectKeyValue[] = [];
    public statuspagegroup?: StatupagegroupViewDetailsRoot;

    protected selectedAutoRefresh: SelectKeyValue = {key: 0, value: 'Disabled'};
    private refreshInterval: any = null;

    private readonly StatuspagegroupWidgetService = inject(StatuspagegroupWidgetService);
    private readonly StatuspagegroupsService = inject(StatuspagegroupsService);


    public override load(): void {
        if (this.widget) {
            this.StatuspagegroupWidgetService.loadWidgetConfig(this.widget.id).subscribe((response) => {
                if (response.statuspagegroup_id) {
                    // Cast any string to number
                    response.statuspagegroup_id = Number(response.statuspagegroup_id);
                    this.loadStatuspagegroupDetails(response.statuspagegroup_id);
                }

                this.config = response;
                this.selectedAutoRefresh.key = this.config.refresh_key ?? 0;
                //trigger refresh for allocated widgets
                if (this.isReadonly()) {
                    this.startRefreshInterval(this.selectedAutoRefresh.key);
                }
                this.cdr.markForCheck();
            });
        }
    }

    public loadStatuspagegroups = (searchString: string): void => {
        const selected: number[] = [];
        if (this.config?.statuspagegroup_id) {
            selected.push(Number(this.config.statuspagegroup_id));
        }

        const params: StatuspagegroupsLoadStatuspagegroupsByStringParams = {
            angular: true,
            'filter[Statuspagegroups.name]': searchString,
            'selected[]': selected
        }

        this.subscriptions.add(this.StatuspagegroupsService.loadStatuspagegroupsByString(params)
            .subscribe((result) => {
                this.statuspagegroups = result;
                this.cdr.markForCheck();
            })
        );
    };

    public ngAfterViewInit(): void {
    }

    public override onAnimationStart(event: AnimationEvent) {
        if (event.toState && this.statuspagegroups.length === 0) {
            // "true" means show config.
            this.loadStatuspagegroups('');
        }

        super.onAnimationStart(event);
    }

    public saveConfig(): void {
        if (this.config && this.widget) {
            this.StatuspagegroupWidgetService.saveWidgetConfig(this.widget.id, this.config).subscribe((response) => {
                // Update the markdown content
                this.load();
                // Close config
                this.flipped.set(false);
            });
        }
    }


    public override ngOnDestroy(): void {
        this.stopRefreshInterval();
        super.ngOnDestroy();
    }

    public onRefreshChange = (value?: SelectKeyValue): void => {
        if (value) {
            this.selectedAutoRefresh = value;
            if (this.config) {
                this.config.refresh_key = this.selectedAutoRefresh.key;
                this.saveConfig();
            }

        }
        this.stopRefreshInterval();
        if (this.selectedAutoRefresh.key > 0) {
            this.startRefreshInterval(this.selectedAutoRefresh.key);
        }

    }

    private startRefreshInterval(interval: number) {
        this.stopRefreshInterval();
        this.refreshInterval = setInterval(() => {
            this.refresh();
        }, interval * 1000);
    }

    protected refresh(): void {
        if (this.config?.statuspagegroup_id) {
            this.loadStatuspagegroupDetails(Number(this.config?.statuspagegroup_id));
            this.cdr.markForCheck();

        }
    }

    private stopRefreshInterval() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        this.refreshInterval = null;
    }

    public override resizeWidget(event?: KtdResizeEnd): void {
    }

    public override layoutUpdate(event: KtdGridLayout): void {
    }

    public loadStatuspagegroupDetails(id: number) {
        this.subscriptions.add(this.StatuspagegroupsService.getStatuspagegroupGetDetails(id).subscribe(response => {
            this.statuspagegroup = response;
            this.cdr.markForCheck();
        }));
    }

    protected readonly Number = Number;
}
