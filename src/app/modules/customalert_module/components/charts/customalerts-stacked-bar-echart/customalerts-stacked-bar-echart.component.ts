import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { PieChartMetric } from '../../../../../components/charts/charts.interface';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../../../layouts/coreui/layout.service';
import { CustomalertStateOverview } from '../../../pages/customalert-rules/customalert-rules.interface';
import { TranslocoService } from '@jsverse/transloco';
import { CustomAlertsState } from '../../../pages/customalerts/customalerts.interface';

@Component({
    selector: 'oitc-customalerts-stacked-bar-echart',
    imports: [
        NgxEchartsDirective
    ],
    providers: [
        provideEchartsCore({echarts}),
    ],
    templateUrl: './customalerts-stacked-bar-echart.component.html',
    styleUrl: './customalerts-stacked-bar-echart.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomalertsStackedBarEchartComponent implements OnDestroy {
    public barChartData = input.required<CustomalertStateOverview>();
    public fromDate = input.required<string>();
    public toDate = input.required<string>();
    public title = input<string>('Host availability');
    public showLegend = input<boolean>(true);
    public chartData = input<PieChartMetric[]>([]);

    public theme: string = '';
    public chartOption: EChartsOption = {};

    public echartsInstance: any;

    private subscriptions: Subscription = new Subscription();
    private readonly LayoutService = inject(LayoutService);
    private readonly TranslocoService = inject(TranslocoService);
    private cdr = inject(ChangeDetectorRef);

    public constructor() {
        this.subscriptions.add(this.LayoutService.theme$.subscribe((theme) => {
            this.theme = '';
            if (theme === 'dark') {
                this.theme = 'dark';
            }

            this.cdr.markForCheck();
        }));

        effect(() => {
            this.renderChart();
            this.cdr.markForCheck();
        });
    }

    private renderChart() {
        var tageImJahr = [];
        var datenNeu = [];
        var datenInBearbeitung = [];
        var datenGeschlossen = [];
        var datenManuellGeschlossen = [];

// Die 3 Trend-Arrays
        var trendEingangAbsolut = [];
        var trendAusgangAbsolut = [];
        var trendSchliessungsQuote = [];

        var summeNeu = 0;
        var summeInBearbeitung = 0;
        var summeGeschlossen = 0;
        var summeManuellGeschlossen = 0;

        var startDatum = new Date(2026, 0, 1);

// Hilfsfunktion für den gleitenden 7-Tage-Durchschnitt
        function berechneSchnitt(array: any, aktuellerIndex: any, tage: any) {
            var start = Math.max(0, aktuellerIndex - tage + 1);
            var summe = 0;
            var zaehler = 0;
            for (var i = start; i <= aktuellerIndex; i++) {
                summe += array[i];
                zaehler++;
            }
            return zaehler > 0 ? summe / zaehler : 0;
        }

        for (var i = 0; i < 365; i++) {
            var tag = ('0' + startDatum.getDate()).slice(-2);
            var monat = ('0' + (startDatum.getMonth() + 1)).slice(-2);
            tageImJahr.push(tag + '.' + monat + '.');
            startDatum.setDate(startDatum.getDate() + 1);

            var wertNeu = Math.floor(Math.random() * 8) + 2;
            var wertInBearbeitung = Math.floor(Math.random() * 10) + 3;
            var wertGeschlossen = Math.floor(Math.random() * 12) + 5;
            var wertManuellGeschlossen = Math.floor(Math.random() * 4) + 1;

            datenNeu.push(wertNeu);
            datenInBearbeitung.push(wertInBearbeitung);
            datenGeschlossen.push(wertGeschlossen);
            datenManuellGeschlossen.push(wertManuellGeschlossen);

            summeNeu += wertNeu;
            summeInBearbeitung += wertInBearbeitung;
            summeGeschlossen += wertGeschlossen;
            summeManuellGeschlossen += wertManuellGeschlossen;

            // REPARIERT: Leerzeichen im Variablennamen entfernt (schnittErledigtGesamt)
            var schnittNeu = berechneSchnitt(datenNeu, i, 7);
            var schnittInBearbeitung = berechneSchnitt(datenInBearbeitung, i, 7);
            var schnittGeschlossen = berechneSchnitt(datenGeschlossen, i, 7);
            var schnittManuell = berechneSchnitt(datenManuellGeschlossen, i, 7);
            var schnittErledigtGesamt = schnittGeschlossen + schnittManuell;

            trendEingangAbsolut.push(Number(schnittNeu.toFixed(1)));
            trendAusgangAbsolut.push(Number(schnittErledigtGesamt.toFixed(1)));

            // 3: Relative Prozentquote berechnen
            var quote = schnittNeu + schnittInBearbeitung > 0 ? (schnittErledigtGesamt / (schnittNeu + schnittInBearbeitung)) * 100 : 100;
            trendSchliessungsQuote.push(Number(quote.toFixed(1)));
        }

        this.chartOption = {
            backgroundColor: 'transparent',
            title: {
                text: this.TranslocoService.translate('Custom alerts overview') + ' [{0} - {1}]'.replace('{0}', this.fromDate).replace('{1}', this.toDate),
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {type: 'shadow'},
                formatter: function (params: any) {
                    if (!params) return '';

                    var html = '<b>' + params.name + '</b><br/>';
                    for (var i = 0; i < params.length; i++) {
                        var marker = params[i].marker;
                        var sName = params[i].seriesName;
                        var val = params[i].value;

                        if (sName === 'Schließungsquote (7T)') {
                            html += marker + ' ' + sName + ': <b>' + val + ' %</b><br/>';
                        } else {
                            html += marker + ' ' + sName + ': ' + val + '<br/>';
                        }
                    }

                    return html;
                }
            },
            legend: {
                // REPARIERT: Die Namen hier stimmen jetzt exakt mit den series-Namen übereinander
                data: [
                    this.TranslocoService.translate('New'),
                    this.TranslocoService.translate('In Progress'),
                    this.TranslocoService.translate('Done'),
                    this.TranslocoService.translate('Manually closed'),
                    'Trend Eingang',
                    'Trend Erledigt',
                    'Schließungsquote (7T)'
                ],
                bottom: '0%',
                formatter: (name) => {
                    if (name === 'New') return name + ' ' + this.TranslocoService.translate('Total:') + ' ' + this.barChartData().total[CustomAlertsState.New];
                    if (name === 'In progress')
                        return name + ' ' + this.TranslocoService.translate('Total:') + ' ' + this.barChartData().total[CustomAlertsState.InProgress];
                    if (name === 'Done') return name + ' ' + this.TranslocoService.translate('Total:') + ' ' + this.barChartData().total[CustomAlertsState.Done];
                    if (name === 'Manually closed')
                        return name + ' ' + this.TranslocoService.translate('Total:') + ' ' + this.barChartData().total[CustomAlertsState.ManuallyClosed];
                    return name;
                }
            },
            grid: {left: '4%', right: '4%', bottom: '22%', containLabel: true},
            xAxis: {
                type: 'category',
                data: tageImJahr,
                axisLabel: {interval: 'auto'}
            },

            yAxis: [
                {
                    type: 'value',
                    name: this.TranslocoService.translate('Alerts count'),
                    position: 'left'
                },
                {
                    type: 'value',
                    name: this.TranslocoService.translate('Quote in %'),
                    position: 'right',
                    axisLabel: {formatter: '{value} %'},
                    splitLine: {show: false}
                }
            ],

            dataZoom: [
                {
                    type: 'slider',
                    show: true,
                    start: 90,
                    end: 100,
                    bottom: '8%',
                    handleSize: '100%'
                },
                {type: 'inside', start: 90, end: 100}
            ],
            series: [
                // --- BALKEN (Linke Y-Achse) ---
                {
                    name: 'New',
                    type: 'bar',
                    stack: 'JahresStack',
                    barMaxWidth: 30,
                    color: '#ff6300',
                    data: datenNeu
                },
                {
                    name: 'In progress',
                    type: 'bar',
                    stack: 'JahresStack',
                    barMaxWidth: 30,
                    color: '#6b7785',
                    data: datenInBearbeitung
                },
                {
                    name: 'Done',
                    type: 'bar',
                    stack: 'JahresStack',
                    barMaxWidth: 30,
                    color: '#00c851',
                    data: datenGeschlossen
                },
                {
                    name: 'Manually closed',
                    type: 'bar',
                    stack: 'JahresStack',
                    barMaxWidth: 30,
                    color: '#5856d6',
                    data: datenManuellGeschlossen
                },

                // --- ABSOLUTE TRENDLINIEN (Linke Y-Achse) ---
                {
                    name: 'Trend Eingang',
                    type: 'line',
                    yAxisIndex: 0,
                    smooth: true,
                    symbol: 'none',
                    lineStyle: {width: 3, type: 'dashed'},
                    color: '#ff7875',
                    data: trendEingangAbsolut
                },
                {
                    name: 'Trend Erledigt',
                    type: 'line',
                    yAxisIndex: 0,
                    smooth: true,
                    symbol: 'none',
                    lineStyle: {width: 3},
                    color: 'magenta',
                    data: trendAusgangAbsolut
                },

                // --- RELATIVE PROZENT-TRENDLINIE (Rechte Y-Achse) ---
                {
                    name: 'Schließungsquote (7T)',
                    type: 'line',
                    yAxisIndex: 1,
                    smooth: true,
                    symbol: 'none',
                    lineStyle: {width: 4},
                    //color: '#722ed1',
                    color: 'purple',
                    data: trendSchliessungsQuote,
                    markLine: {
                        silent: true,
                        symbol: ['none', 'arrow'],
                        label: {
                            position: 'end',
                            distance: 45,
                            fontSize: 10,
                            formatter: this.TranslocoService.translate('Goal: 100%'),
                            color: '#33b5e5'

                        },
                        lineStyle: {
                            color: '#33b5e5',
                            type: 'dotted',
                            width: 2
                        },
                        data: [{yAxis: 100}]
                    }
                }
            ]
        };
        this.cdr.markForCheck();
    }


    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onChartInit(ec: any) {
        this.echartsInstance = ec;
        this.cdr.markForCheck();
    }

}
