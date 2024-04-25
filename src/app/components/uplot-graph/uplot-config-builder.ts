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