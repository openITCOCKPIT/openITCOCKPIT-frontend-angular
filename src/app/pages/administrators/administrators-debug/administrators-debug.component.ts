import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
    AlertComponent,
    AlertHeadingDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective,
    TooltipDirective
} from '@coreui/angular';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SystemnameService } from '../../../services/systemname.service';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { AdministratorsDebugRootResponse } from '../administrators.interface';
import { OitcAlertComponent } from '../../../components/alert/alert.component';
import { AdministratorsService } from '../administrators.service';
import { CookieService } from 'ngx-cookie-service';
import { EolAlertsComponent } from './eol-alerts/eol-alerts.component';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';
import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { DateTime } from 'luxon';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from 'echarts/components';
import { TimezoneService } from '../../../services/timezone.service';

import 'echarts/theme/dark.js';
import { LayoutService } from '../../../layouts/coreui/layout.service';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TimezoneObject } from '../../services/timezone.interface';


echarts.use([BarChart, LineChart, GridComponent, LegendComponent, TitleComponent, TooltipComponent, ToolboxComponent]);


@Component({
    selector: 'oitc-administrators-debug',
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        RouterLink,
        AsyncPipe,
        CardBodyComponent,
        RowComponent,
        ColComponent,
        NgIf,
        OitcAlertComponent,
        NgClass,
        EolAlertsComponent,
        BlockLoaderComponent,
        AlertComponent,
        AlertHeadingDirective,
        TableDirective,
        BadgeOutlineComponent,
        TooltipDirective,
        TranslocoPipe,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        NgxEchartsDirective
    ],
    templateUrl: './administrators-debug.component.html',
    styleUrl: './administrators-debug.component.css',
    providers: [
        provideEchartsCore({echarts}),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdministratorsDebugComponent implements OnInit, OnDestroy {

    public response?: AdministratorsDebugRootResponse;
    public hasXdebugCookie: boolean = false;

    private timezone?: TimezoneObject;
    public chartOption: EChartsOption = {};
    public echartsInstance: any;
    public theme: null | 'dark' = null;

    private subscriptions: Subscription = new Subscription();
    public readonly SystemnameService = inject(SystemnameService);
    public readonly AdministratorsService = inject(AdministratorsService);
    private readonly CookieService = inject(CookieService);
    private readonly LayoutService = inject(LayoutService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private cdr = inject(ChangeDetectorRef);
    private readonly TimezoneService: TimezoneService = inject(TimezoneService);


    public constructor() {
        this.subscriptions.add(this.LayoutService.theme$.subscribe((theme) => {
            this.theme = null;
            if (theme === 'dark') {
                this.theme = 'dark';
            }

            this.cdr.markForCheck();
        }));
    }

    public ngOnInit(): void {
        this.load();
        this.getUserTimezone();
        this.hasXdebugCookie = this.CookieService.check('XDEBUG_TRIGGER');
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load() {
        this.subscriptions.add(
            this.AdministratorsService.getDebug().subscribe(response => {
                this.response = response;

                this.renderChart();

                this.cdr.markForCheck();
            })
        );
    }

    public setXdebugCookie() {
        this.hasXdebugCookie = true;
        this.CookieService.set('XDEBUG_TRIGGER', 'true', {
            expires: undefined,
            secure: true,
            path: '/',
            sameSite: 'None'
        });
        this.cdr.markForCheck();
    }

    public removeXdebugCookie() {
        this.CookieService.delete('XDEBUG_TRIGGER', '/');
        this.hasXdebugCookie = false;
        this.cdr.markForCheck();
    }

    onChartInit(ec: any) {
        this.echartsInstance = ec;
    }

    private getUserTimezone() {
        this.subscriptions.add(this.TimezoneService.getTimezoneConfiguration().subscribe(data => {
            this.timezone = data;
            this.cdr.markForCheck();
        }));
    }

    private renderChart() {
        if (!this.response) {
            return;
        }

        const load1: [string, number][] = [];
        const load5: [string, number][] = [];
        const load15: [string, number][] = [];
        for (let isoTimestamp in this.response.cpuLoadHistoryInformation['1']) {
            load1.push([isoTimestamp, this.response.cpuLoadHistoryInformation['1'][isoTimestamp]]);
        }
        for (let isoTimestamp in this.response.cpuLoadHistoryInformation['5']) {
            load5.push([isoTimestamp, this.response.cpuLoadHistoryInformation['5'][isoTimestamp]]);
        }
        for (let isoTimestamp in this.response.cpuLoadHistoryInformation['15']) {
            load15.push([isoTimestamp, this.response.cpuLoadHistoryInformation['15'][isoTimestamp]]);
        }

        this.chartOption = {
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'time',
                axisLabel: {
                    formatter: (value) => {
                        if (this.timezone) {
                            const dateTime = DateTime.fromMillis(value).setZone(this.timezone.user_timezone);
                            return dateTime.toFormat('dd.LL.yyyy HH:mm:ss');
                        }
                        return value.toString();
                    }
                },
                splitLine: {
                    show: true,
                },
                axisTick: {
                    show: true,
                },
                minorSplitLine: {
                    show: true
                }

            },
            yAxis: {
                type: 'value',
                //name: gauge.datasource.setup.metric.unit,
                minorTick: {
                    show: true
                },
                minorSplitLine: {
                    show: true
                },
                name: this.TranslocoService.translate('CPU Load'),
                nameLocation: 'middle',
                nameGap: 35,
            },

            grid: {
                left: 40,
                right: 10,
                top: 20,
                bottom: 10,
                containLabel: true
            },
            legend: {
                data: [
                    this.TranslocoService.translate('Load 1'),
                    this.TranslocoService.translate('Load 5'),
                    this.TranslocoService.translate('Load 15')
                ]
            },

            // https://stackoverflow.com/a/76809216
            // https://echarts.apache.org/examples/en/editor.html?c=line-sections&code=MYewdgzgLgBAJgQygmBeGBtAUDGBvADwC4YAGAGhgE8SBmU0gX0sJIEZKaYAmADiZbEenEtwCsA_ENoieANkmsYAFlncA7IqFjZ9LSTmyxE5lJLqjDZjjMxes5VcEkAnLpf6YbCtTr9TSmwcvjC0HgFCbNwOTrZsMiESnmyqIQrJOiHqJuQ2gYYh_MkWWbGB9mllkW4hjkxYALoA3FhYoJCwEACmAE4All0QADJ90GiYzW3gYwBmfQA2UL1dcAAiSAjdUBDjGJNYMwCuYMBQfeAwwD1dSF0Ayr0Dw6NQABSIyACU-DYzID0wV7zLqwPpgOBdAjjUhNGBgiFQgA88A2ADpgWAAOZQAAWMAAtF5YfDIQBqUnfPA2XDtMYfTYggCScHGAHJ6VsAPqsmCkuHgyEtXA06awDkgu7zPrAFbjemoiBSmWvEkESiq3k8T5C4VzRbLNYbLYQVEAB0OEBxrypwuFfTgJHFUGZuVtuAgIEOPRljqNEqVK2pMEY2qDfRmgI1yLkMAAPrH-QiYAA-Lwx-ORgVQ1PqGAAMjzichMGRKU-lKD7segxG0DNFqtNrduCgVFNXRIrKlYC6rNdzZRyC2zN9Q6ZcH7zdA83-ncx1y6YD7leFCGuCDureBJDwlxAM56nalmJxUHnXUXPMYK5DOtwjBgXXm3R-ze6_RrL3rlutK5bbY7GAuzBXtJzdJ0R0HBlnQnP89wPTtrjgZcBxgNcbk3Kht3weDZyAnpMQAIwQV5xEyNh1ASCj1E-K8b1DW1r3vLBryuG4lgeD9nmgd4NlDLAQFNM4LnQJsnRIPUliQ9Yx22fszigbCmxbSEoE7VYXn6QjDmEsAYBACMAFFgVOfpgD6VsUOFCBDkIpYCDUoCADEEAAay6GAZIQVkbGsFsQH3M5TR3IMoH6TFMV6TsEAIUYrNwGLRgABRAMEpJC5tW3bTsrhACAIB8xjfPkgL5kIkAhGUmBLRAAB3EgwsOLowJmdivUAqr3QQAA3LoAEEIEZABbBBIp3JjhQmvyYAIPrYogDLhSywDWWAW5MX-Kh4pgcrjkQHoqAAcQQYKYBmBBn2aoMAHprpgU1rigM5enxPpMTAf4uiDekSAwVkGCIBg-yA0g2CINgxGB_7uCIegodIWgiGUSHKH-sRAdIeG5HBlGQfUWHMdR0heCR3HWW8DGoaCHGqZhuHUfiUmqfRoGGexiGqfx-mgLYEnkah7hSEp1HuDBjmRbpwmgO4RH-YaYqbCoObRkW_9sqA7qLqa7bEuGBBCKfVXdX-EanqioC8E1-YmofAB1QrJrA3WUrS83OuqsAToanomqDKb-3fJ4SEDz9oBYpogA&lang=ts
            series: [
                {
                    name: this.TranslocoService.translate('Load 1'),
                    type: 'line',
                    lineStyle: {
                        width: 2,
                        //color: 'rgb(88,86,214)',
                    },

                    smooth: false,
                    data: load1
                },
                {
                    name: this.TranslocoService.translate('Load 5'),
                    type: 'line',
                    lineStyle: {
                        width: 2,
                        //color: 'rgb(88,86,214)',
                    },

                    smooth: false,
                    data: load5
                },
                {
                    name: this.TranslocoService.translate('Load 15'),
                    type: 'line',
                    lineStyle: {
                        width: 2,
                        //color: 'rgb(88,86,214)',
                    },

                    smooth: false,
                    data: load15
                },
            ],
        };

        this.cdr.markForCheck();
    }

    public sendTestMail() {
        // todo
        console.log('TODO IMPLEMENT ME');
    }

}
