import uPlot from 'uplot';
import { inject, Injectable} from "@angular/core";
@Injectable({
    providedIn: 'root'
})
export class UPlotConfigBuilder {
    private can = document.createElement("canvas");
    private ctx = this.can.getContext("2d");
    private fillColors = ["rgb(18, 132, 10, 0.2)", "rgb(255, 187, 51, 0.2)", "rgb(204, 0, 0, 0.2)"] //ok,warn, crit
    private borderColors = ["rgb(18, 132, 10, 1)", "rgb(255, 187, 51, 1)", "rgb(192, 0, 0, 1)"]
    private fmtDate = uPlot.fmtDate("{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}");
    constructor() { }

    public getColor( warn: number, crit: number, data:number): string[] {
        const fillColors = ["rgb(18, 132, 10, 0.2)", "rgb(255, 187, 51, 0.2)", "rgb(204, 0, 0, 0.2)"] //ok,warn, crit
        const borderColors = ["rgb(18, 132, 10, 1)", "rgb(255, 187, 51, 1)", "rgb(192, 0, 0, 1)"] //ok,warn, crit
        let fColor = fillColors[0];
        let bColor = borderColors[0];
        if(data > warn && data < crit) {
            fColor = fillColors[1];
            bColor = borderColors[1];
        }
        if (data >= crit) {
            fColor = fillColors[2];
            bColor = borderColors[2];
        }

        return [fColor, bColor];

    }


    public scaleGradient = (u: any, scaleKey: any, ori: any, scaleStops: any, discrete = false) =>{
        let scale = u.scales[scaleKey];

        // we want the stop below or at the scaleMax
        // and the stop below or at the scaleMin, else the stop above scaleMin
        let minStopIdx: any;
        let maxStopIdx: any;

        for(let i = 0; i < scaleStops.length; i++){
            let stopVal = scaleStops[i][0];

            if(stopVal <= scale.min || minStopIdx == null)
                minStopIdx = i;

            maxStopIdx = i;

            if(stopVal >= scale.max)
                break;
        }

        if(minStopIdx == maxStopIdx)
            return scaleStops[minStopIdx][1];

        let minStopVal = scaleStops[minStopIdx][0];
        let maxStopVal = scaleStops[maxStopIdx][0];

        if(minStopVal == -Infinity)
            minStopVal = scale.min;

        if(maxStopVal == Infinity)
            maxStopVal = scale.max;

        let minStopPos = u.valToPos(minStopVal, scaleKey, true);
        let maxStopPos = u.valToPos(maxStopVal, scaleKey, true);

        let range = minStopPos - maxStopPos;

        let x0, y0, x1, y1;

        if(ori == 1){
            x0 = x1 = 0;
            y0 = minStopPos;
            y1 = maxStopPos;
        }else{
            y0 = y1 = 0;
            x0 = minStopPos;
            x1 = maxStopPos;
        }

        // @ts-ignore
        let grd = this.ctx.createLinearGradient(x0, y0, x1, y1);

        let prevColor;

        for(let i = minStopIdx; i <= maxStopIdx; i++){
            let s = scaleStops[i];

            let stopPos = i == minStopIdx ? minStopPos : i == maxStopIdx ? maxStopPos : u.valToPos(s[0], scaleKey, true);
            let pct = (minStopPos - stopPos) / range;

            if(discrete && i > minStopIdx)
                grd.addColorStop(pct, prevColor);

            grd.addColorStop(pct, prevColor = s[1]);
        }

        return grd;
    };





}