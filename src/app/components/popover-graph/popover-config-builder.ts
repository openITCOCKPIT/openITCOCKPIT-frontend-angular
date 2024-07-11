import uPlot from 'uplot';


export interface GraphThresholds {
    show: boolean,
    warning: number | string | null,
    critical: number | string | null
}

export class PopoverConfigBuilder {
    public can: HTMLCanvasElement = document.createElement("canvas");
    public ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>this.can.getContext('2d');

    // All properties are public, so we do not need to define them in the constructor or initialize them
    public title: string = "Area Chart";
    public label: string | false = "";
    public height: number = 250;
    public width: number = 350;
    public timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone
    public lineWidth: number = 3;
    public thresholds: GraphThresholds = {
        show: true,
        warning: null,
        critical: null
    };
    public start: number = 0;
    public end: number = (new Date().getTime());
    public strokeColor: string = "rgba(50, 116, 217, 1)";
    public fillColor: string = "rgba(50, 116, 217, 0.2)";
    public YAxisLabelLength: number = 50;
    public unit: string = '';

    // Gradient thresholds vars
    private thresholdColors: any = [];
    private colors = {
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


    public getColorByIndex(index: number) {
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

        if (typeof colors.stroke[index] == "undefined") {
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

    public getOptions() {
        // @ts-ignore
        const _linear: uPlot.Series.PathBuilder = <uPlot.Series.PathBuilder>uPlot.paths.linear();
        // @ts-ignore
        const _spline: uPlot.Series.PathBuilder = <uPlot.Series.PathBuilder>uPlot.paths.spline();

        let cssTextColor = getComputedStyle(document.documentElement).getPropertyValue('--cui-body-color').trim();

        let uPlotOptions = {
            unit: this.unit,
            title: this.title,
            width: this.width,
            height: this.height,
            tzDate: (ts: number) => {
                return uPlot.tzDate(new Date(ts * 1000), this.timezone)
            },
            cursor: {
                drag: {
                    x: true,
                    y: false,
                },
                points: {
                    stroke: this.pointColorFn(0.5).bind(this),
                    fill: this.pointColorFn().bind(this),
                    size: 10,
                    width: 2.5
                }
            },
            scales: {
                x: {
                    time: true,
                    auto: true,
                    min: this.start,
                    max: this.end,
                    //range: [opts.start, opts.end],
                },
            },
            series: [
                {},
                {
                    label: null,
                    width: this.lineWidth,
                    paths: _spline,

                    stroke: this.strokeColor,
                    fill: this.fillColor,
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
                    label: this.label,
                    stroke: cssTextColor,
                    // @formatter:on
                },
                {
                    // https://github.com/leeoniya/uPlot/blob/master/docs/README.md#axis--grid-opts,
                    stroke: cssTextColor,
                    size: this.YAxisLabelLength,
                    values: (u: uPlot, vals: any[], space: any) => {
                        return vals.map((v) => {
                            return v + ' ' + this.unit;
                        });
                    }
                },
            ],
            legend: {
                show: false
            }
        };

        if (this.thresholds.show) {
            if (this.thresholds.warning !== "" &&
                this.thresholds.critical !== "" &&
                this.thresholds.warning !== null &&
                this.thresholds.critical !== null) {
                this.thresholds.warning = parseFloat(this.thresholds.warning.toString());
                this.thresholds.critical = parseFloat(this.thresholds.critical.toString());
                if (this.thresholds.critical > this.thresholds.warning) {
                    // Normal thresholds like for a Ping
                    // .stroke and .fill are not known to TypeScript I don't know why - its hardcoded a few lines above
                    // @ts-ignore
                    uPlotOptions.series[1].stroke = (u: uPlot, seriesIdx: number) => {
                        return this.scaleGradient(u, 'y', 1, [
                            [0, "rgba(86, 166, 75, 1)"],
                            [this.thresholds.warning, "rgba(234, 184, 57, 1)"],
                            [this.thresholds.critical, "rgba(224, 47, 68, 1)"],
                        ], true)
                    };

                    // @ts-ignore
                    uPlotOptions.series[1].fill = (u: uPlot, seriesIdx: number) => {
                        return this.scaleGradient(u, 'y', 1, [
                            [0, "rgba(86, 166, 75, 0.2)"],
                            [this.thresholds.warning, "rgba(234, 184, 57, 0.2)"],
                            [this.thresholds.critical, "rgba(224, 47, 68, 0.2)"]
                        ], true)
                    };

                    // Save the thresholds, so we can set the color for the mouse over point
                    this.thresholdColors = [
                        [0, "rgba(86, 166, 75, 0.2)"],
                        [this.thresholds.warning, "rgba(234, 184, 57, 0.2)"],
                        [this.thresholds.critical, "rgba(224, 47, 68, 0.2)"]
                    ];

                } else {
                    // warning is < than critical, Free disk space for example
                    // @ts-ignore
                    uPlotOptions.series[1].stroke = (u: uPlot, seriesIdx: number) => {
                        return this.scaleGradient(u, 'y', 1, [
                            [0, "rgba(224, 47, 68, 1)"],
                            [this.thresholds.critical, "rgba(234, 184, 57, 1)"],
                            [this.thresholds.warning, "rgba(86, 166, 75, 1)"],
                        ], true)
                    };

                    // @ts-ignore
                    uPlotOptions.series[1].fill = (u: uPlot, seriesIdx: number) => {
                        return this.scaleGradient(u, 'y', 1, [
                            [0, "rgba(224, 47, 68, 0.2)"],
                            [this.thresholds.critical, "rgba(234, 184, 57, 0.2)"],
                            [this.thresholds.warning, "rgba(86, 166, 75, 0.2)"]
                        ], true)
                    };

                    // Save the thresholds, so we can set the color for the mouse over point
                    this.thresholdColors = [
                        [0, "rgba(224, 47, 68, 0.2)"],
                        [this.thresholds.critical, "rgba(234, 184, 57, 0.2)"],
                        [this.thresholds.warning, "rgba(86, 166, 75, 0.2)"]
                    ];
                }
            }
        }
        return uPlotOptions;
    }

    private scaleGradient = (u: uPlot, scaleKey: string, ori: number, scaleStops: any, discrete: boolean = false): CanvasGradient => {
        let scale = u.scales[scaleKey];

        // we want the stop below or at the scaleMax
        // and the stop below or at the scaleMin, else the stop above scaleMin
        let minStopIdx = 0;
        let maxStopIdx = 0;

        for (let i = 0; i < scaleStops.length; i++) {
            let stopVal = scaleStops[i][0];

            if (scale.min) {
                if (stopVal <= scale.min || minStopIdx == null)
                    minStopIdx = i;
            }

            maxStopIdx = i;

            if (scale.max) {
                if (stopVal >= scale.max)
                    break;
            }
        }

        if (minStopIdx == maxStopIdx)
            return scaleStops[minStopIdx][1];

        let minStopVal = scaleStops[minStopIdx][0];
        let maxStopVal = scaleStops[maxStopIdx][0];

        if (minStopVal == -Infinity) {
            if (scale.min) {
                minStopVal = scale.min;
            }
        }

        if (maxStopVal == Infinity) {
            if (scale.max) {
                maxStopVal = scale.max;
            }
        }

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


    public pointColorFn(alpha?: number | null) {
        if (typeof alpha === "undefined") {
            alpha = null;
        }

        return (u: uPlot, seriesIdx: number) => {
            let parseRgba = (rgba: string) => {
                // https://stackoverflow.com/questions/34980574/how-to-extract-color-values-from-rgb-string-in-javascript#comment107835204_34980657
                let parsedRgbaString = rgba.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d*)?)\))?/);
                let r, g, b = '0';
                let a = '1';
                if (parsedRgbaString) {
                    r = parsedRgbaString[1] || '0';
                    g = parsedRgbaString[2] || '0';
                    b = parsedRgbaString[3] || '0';
                    a = parsedRgbaString[4] || '1';
                }
                return [r, g, b, a];
            };

            // @ts-ignore
            let s = u.series[seriesIdx].points._stroke;
            // interpolate for gradients/thresholds
            if (typeof s !== 'string') {
                //let timestamp = u.data[0][u.cursor.idxs[0]];

                let pointColor = 'rgba(0,0,0,1)';

                // @ts-ignore
                let currentValue = u.data[1][u.cursor.idxs[0]];

                for (let i in this.thresholdColors) {
                    let threshold = this.thresholdColors[i][0];
                    let color = this.thresholdColors[i][1];

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
                    a = Number(alpha);
                }

                return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
            }

            let rgba = parseRgba(s);
            let r = rgba[0];
            let g = rgba[1];
            let b = rgba[2];
            let a = rgba[3];

            if (alpha !== null) {
                a = String(alpha);
            }

            return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
        };
    }

}
