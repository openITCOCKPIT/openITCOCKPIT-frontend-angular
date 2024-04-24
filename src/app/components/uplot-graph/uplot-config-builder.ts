import uPlot from 'uplot';
import { inject, Injectable} from "@angular/core";
import * as _uPlot from 'uplot';

@Injectable({
    providedIn: 'root'
})


export class UPlotConfigBuilder {
    private unit:string = '';
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

    public can = document.createElement("canvas");
    public ctx:CanvasRenderingContext2D | null = this.can.getContext("2d");


    public getDefaultOptions() {
    let options: _uPlot.Options = {
        plugins: [],
        height: 300, width: 900,
        cursor: {
            drag: {
                x: true,
                y: false
            },
            focus: {
                prox: 3,
            },

        },
        scales: {
            x: {
                time: true,
                auto: true,
                min: 0,
                max: new Date().getTime()
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
                label: "",
                width: 2,
                points: {show: false}
            }

        ],
        axes: [
            {
                label: "Time",
                values: [
                    // tick incr  default       year                        month   day                  hour   min               sec  mode
                    [3600 * 24 * 365, "{YYYY}", null, null, null, null, null, null, 1],
                    [3600 * 24 * 28, "{MMM}", "\n{YYYY}", null, null, null, null, null, 1],
                    [3600 * 24, "{D}/{M}", "\n{YYYY}", null, null, null, null, null, 1],
                    [3600, "{HH}", "\n{D}/{M}/{YY}", null, "\n{D}/{M}", null, null, null, 1],
                    [60, "{HH}:{mm}\n{DD}/{MM}/{YY}", null, null, null, null, null, null, 1],
                    [1, ":{ss}", "\n{D}/{M}/{YY} {HH}:{mm}", null, "\n{D}/{M} {HH}:{mm}", null, "\n{HH}:{mm}", null, 1],
                    [0.001, ":{ss}.{fff}", "\n{D}/{M}/{YY} {HH}:{mm}", null, "\n{D}/{M} {HH}:{mm}", null, "\n{HH}:{mm}", null, 1],
                ]
            },
            {
                label: "",
            }
        ],
        legend: {
            show: false
        },
        hooks: {
            setSelect: [
                u => {
                    if (u.select.width > 0) {
                        let min = Math.floor(u.posToVal(u.select.left, 'x'));
                        let max = Math.floor(u.posToVal(u.select.left + u.select.width, 'x'));
                        //this.setZoom(min, max);
                        // console.log("Fetching data for range...", min, max);
                    }
                }
            ],
        }
    };
    return options;
}

    constructor() { }

    public getColors = () => {
        return this.colors;
    }

    public scaleGradient = (u: uPlot, scaleKey: string, ori: number, scaleStops: any, discrete: boolean = false) : CanvasGradient => {
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