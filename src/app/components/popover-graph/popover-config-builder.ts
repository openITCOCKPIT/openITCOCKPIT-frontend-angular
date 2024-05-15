import uPlot from 'uplot';
import {inject, Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})


export class PopoverConfigBuilder {
    public can = document.createElement("canvas");
    public ctx: CanvasRenderingContext2D | null = this.can.getContext("2d");
    public unit: string = '';
    public seriesIdx = 0;
    public dataIdx = null;
    public over = {};

    public fmtDate = uPlot.fmtDate("{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}");


    // Gradient thresholds vars
    public thresholdColors: any = [];
    public colors = {
        stroke: {
            default: "rgba(50, 116, 217, 1)",
            ok: "rgb(18, 132, 10, 1)",
            warn: "rgb(255, 187, 51, 1)",
            crit: "rgb(192, 0, 0, 1)"
        },
        fill: {
            default: "rgba(50, 116, 217, 0.2)",
            ok: "rgb(18, 132, 10, 0.2)",
            warn: "rgb(255, 187, 51, 0.2)",
            crit: "rgb(204, 0, 0, 0.2)"
        }
    };

    constructor () {
    }

    public getColors = () => {
        return this.colors;
    }

    public getColorByIndex(index:number) {
        let colors = {
            stroke: [
                "rgba(50, 116, 217, 1)",
                "rgba(0,200,81, 1)",
                "rgba(163, 82, 204, 1)",
                "rgba(255, 120, 10, 1)"
            ],
            fill: [
                "rgba(50, 116, 217, 0.2)",
                "rgba(0,200,81, 0.2)",
                "rgba(163, 82, 204, 0.2)",
                "rgba(255, 120, 10, 0.2)"
            ]
        };

        if(typeof colors.stroke[index] == "undefined"){
            return {
                stroke: "rgba(255, 120, 10, 1)",
                fill: "rgba(255, 120, 10, 0.2)"
            };
        }

        return {
            stroke: colors.stroke[index],
            fill: colors.fill[index],
        };
    }

   public getDefaultOptions (opts: any) {
       const {linear, spline, stepped, bars} = uPlot.paths;
       if (linear) {
           const _linear = linear();
       }
       if (spline) {
           const _spline = spline();
       }
       opts = opts || {};
       opts.unit = opts.unit || '';
       opts.timezone = opts.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
       opts.showLegend = opts.showLegend !== false;
       opts.lineWidth = opts.lineWidth || 3;
       opts.thresholds = opts.thresholds || {};
       opts.thresholds.show = opts.thresholds.show !== false;
       opts.thresholds.warning = opts.thresholds.warning || null;
       opts.thresholds.critical = opts.thresholds.critical || null;

       opts.start = opts.start || 0;
       opts.end = opts.end || new Date().getTime();

       opts.strokeColor = opts.strokeColor || "rgba(50, 116, 217, 1)";
       opts.fillColor = opts.fillColor || "rgba(50, 116, 217, 0.2)";

       opts.enableTooltip = opts.enableTooltip !== false;
       opts.YAxisLabelLength = opts.YAxisLabelLength || 50;

       this.unit = opts.unit;


           let uPlotOptions = {
               title: "Area Chart",
               height: 100,
               width: 600,

               cursor: {
                   drag: {
                       x: true,
                       y: false,
                   },
                 /* points: {
                       stroke: this.pointColorFn(0.5).bind(this),
                       fill: this.pointColorFn(null).bind(this),
                       size: 10,
                       width: 2.5
                   } */
               },
               scales: {
                   x: {
                       time: true,
                       auto: true,
                       min: opts.start,
                       max: opts.end,
                       //range: [opts.start, opts.end],
                   },
                   y: {
                       auto: true,
                       // range: (self, dataMin, dataMax) => uPlot.rangeNum(0, dataMax, 0.2, true),
                       distr: 1

                   }
               },
               series: [
                   {},
                   {


                       label: "Series Title",
                       width: opts.lineWidth,
                       //paths: spline(),

                       stroke: opts.strokeColor,
                       fill: opts.fillColor,
                       points: {
                           show: false
                       },
                   },


               ],
               axes: [
                   {
                       // https://github.com/leeoniya/uPlot/tree/master/docs#axis--grid-opts
                       // https://github.com/leeoniya/uPlot/blob/master/src/fmtDate.js#L65-L107
                       // @formatter:off
                    label: "Time",
                values: [
                    // tick incr          default           year                             month    day                        hour     min                sec       mode
                    [3600 * 24 * 365,   "{YYYY}",         null,                            null,    null,                      null,    null,              null,        1],
                    [3600 * 24 * 28,    "{MMM}",          "\n{YYYY}",                      null,    null,                      null,    null,              null,        1],
                    [3600 * 24,         "{M}/{D}",        "\n{YYYY}",                      null,    null,                      null,    null,              null,        1],
                    [3600,              "{h}{aa}",        "\n{M}/{D}/{YY}",                null,    null,                      null,    null,              null,        1],
                    [60,                "{HH}:{mm}",      null,                            null,    null,                      null,    null,              null,        1],
                    [1,                 ":{ss}",          "\n{M}/{D}/{YY} {h}:{mm}{aa}",   null,    "\n{M}/{D} {h}:{mm}{aa}",  null,    "\n{h}:{mm}{aa}",  null,        1],
                    [0.001,             ":{ss}.{fff}",    "\n{M}/{D}/{YY} {h}:{mm}{aa}",   null,    "\n{M}/{D} {h}:{mm}{aa}",  null,    "\n{h}:{mm}{aa}",  null,        1],
                ],
                // @formatter:on
                   },
                   {
                       label: "",
                       values: function (u: uPlot, vals: any[], space: any) {
                           return vals.map((v) => {
                               return v;
                           });
                       }
                   }
               ],
               legend: {
                   show: opts.showLegend
               }
           };

        if (opts.thresholds.show) {
            if (opts.thresholds.warning !== "" &&
                opts.thresholds.critical !== "" &&
                opts.thresholds.warning !== null &&
                opts.thresholds.critical !== null) {
                opts.thresholds.warning = parseFloat(opts.thresholds.warning);
                opts.thresholds.critical = parseFloat(opts.thresholds.critical);
                if (opts.thresholds.critical > opts.thresholds.warning) {
                    // Normal thresholds like for a Ping
                    uPlotOptions.series[1].stroke = (u: uPlot, seriesIdx: number) => {
                        return this.scaleGradient(u, 'y', 1, [
                            [0, "rgba(86, 166, 75, 1)"],
                            [opts.thresholds.warning, "rgba(234, 184, 57, 1)"],
                            [opts.thresholds.critical, "rgba(224, 47, 68, 1)"],
                        ], true)
                    };

                    uPlotOptions.series[1].fill = (u: uPlot, seriesIdx: number) => {
                        return this.scaleGradient(u, 'y', 1, [
                            [0, "rgba(86, 166, 75, 0.2)"],
                            [opts.thresholds.warning, "rgba(234, 184, 57, 0.2)"],
                            [opts.thresholds.critical, "rgba(224, 47, 68, 0.2)"]
                        ], true)
                    };

                    // Save the thresholds so we can set the color for the mouse over point
                    this.thresholdColors = [
                        [0, "rgba(86, 166, 75, 0.2)"],
                        [opts.thresholds.warning, "rgba(234, 184, 57, 0.2)"],
                        [opts.thresholds.critical, "rgba(224, 47, 68, 0.2)"]
                    ];

                } else {
                    // warning is < than critical, Free disk space for example
                    uPlotOptions.series[1].stroke = (u: uPlot, seriesIdx: number) => {
                        return this.scaleGradient(u, 'y', 1, [
                            [0, "rgba(224, 47, 68, 1)"],
                            [opts.thresholds.critical, "rgba(234, 184, 57, 1)"],
                            [opts.thresholds.warning, "rgba(86, 166, 75, 1)"],
                        ], true)
                    };

                    uPlotOptions.series[1].fill = (u: uPlot, seriesIdx: number) => {
                        return this.scaleGradient(u, 'y', 1, [
                            [0, "rgba(224, 47, 68, 0.2)"],
                            [opts.thresholds.critical, "rgba(234, 184, 57, 0.2)"],
                            [opts.thresholds.warning, "rgba(86, 166, 75, 0.2)"]
                        ], true)
                    };

                    // Save the thresholds so we can set the color for the mouse over point
                    this.thresholdColors = [
                        [0, "rgba(224, 47, 68, 0.2)"],
                        [opts.thresholds.critical, "rgba(234, 184, 57, 0.2)"],
                        [opts.thresholds.warning, "rgba(86, 166, 75, 0.2)"]
                    ];
                }
            }
        }
       return uPlotOptions;
    }

    pointColorFn (alpha: any) {
        if (typeof alpha === "undefined") {
            alpha = null;
        }
        return (u: uPlot, seriesIdx: number) => {
            let parseRgba: any = function (rgba: string) {
                // https://stackoverflow.com/questions/34980574/how-to-extract-color-values-from-rgb-string-in-javascript#comment107835204_34980657
                let parsedRgbaString = rgba.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d*)?)\))?/);
                if (parsedRgbaString) {
                    let r = parsedRgbaString[1];
                    let g = parsedRgbaString[2];
                    let b = parsedRgbaString[3];
                    let a = parsedRgbaString[4]
                }


                return [r, g, b, a];
            };

            // @ts-ignore
            let s = u.series[seriesIdx].points._stroke;
            // interpolate for gradients/thresholds
            if (typeof s !== 'string') {
                //var timestamp = u.data[0][u.cursor.idxs[0]];

                var pointColor = 'rgba(0,0,0,1)';

                // @ts-ignore
                var currentValue = u.data[1][u.cursor.idxs[0]];

                for (var i in this.thresholdColors) {
                    var threshold = this.thresholdColors[i][0];
                    var color = this.thresholdColors[i][1];

                    if (currentValue >= threshold) {
                        pointColor = color;
                    }
                }

                let rgba = parseRgba(pointColor);
                let r = rgba[0];
                let g = rgba[1];
                let b = rgba[2];
                let a = 1;

                if (alpha !== null) {
                    a = alpha;
                }

                return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
            }

            let rgba = parseRgba(s);
            var r = rgba[0];
            var g = rgba[1];
            var b = rgba[2];
            var a = rgba[3];

            if (alpha !== null) {
                a = alpha;
            }

            return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
        };


    }

    private scaleGradient = (u: uPlot, scaleKey: string, ori: number, scaleStops: any, discrete: boolean = false): CanvasGradient => {
        let scale: uPlot.Scale = u.scales[scaleKey];

        // we want the stop below or at the scaleMax
        // and the stop below or at the scaleMin, else the stop above scaleMin
        let minStopIdx: number = 0;
        let maxStopIdx: number = 0;

        for (let i = 0; i < scaleStops.length; i++) {
            let stopVal: number = scaleStops[i][0];
            // @ts-ignore
            if (stopVal <= scale.min || minStopIdx == null)
                minStopIdx = i;

            maxStopIdx = i;

            // @ts-ignore
            if (stopVal >= scale.max)
                break;
        }

        if (minStopIdx == maxStopIdx) {
            return scaleStops[minStopIdx][1];
        }

        let minStopVal = scaleStops[minStopIdx][0];
        let maxStopVal = scaleStops[maxStopIdx][0];

        if (minStopVal == -Infinity)
            minStopVal = scale.min;

        if (maxStopVal == Infinity)
            maxStopVal = scale.max;

        let minStopPos = u.valToPos(minStopVal, scaleKey, true);
        let maxStopPos = u.valToPos(maxStopVal, scaleKey, true);

        let range = minStopPos - maxStopPos;

        let x0, y0, x1, y1;

        if (ori == 1) {
            x0 = x1 = 0;
            y0 = minStopPos;
            y1 = maxStopPos;
        } else {
            y0 = y1 = 0;
            x0 = minStopPos;
            x1 = maxStopPos;
        }

        // @ts-ignore
        let grd = this.ctx.createLinearGradient(x0, y0, x1, y1);

        let prevColor;

        for (let i = minStopIdx; i <= maxStopIdx; i++) {
            let s = scaleStops[i];

            let stopPos = i == minStopIdx ? minStopPos : i == maxStopIdx ? maxStopPos : u.valToPos(s[0], scaleKey, true);
            let pct = (minStopPos - stopPos) / range;

            if (discrete && i > minStopIdx)
                grd.addColorStop(pct, prevColor);

            grd.addColorStop(pct, prevColor = s[1]);
        }

        return grd;
    }


}