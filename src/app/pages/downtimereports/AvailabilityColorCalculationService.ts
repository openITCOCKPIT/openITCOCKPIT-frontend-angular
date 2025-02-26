import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AvailabilityColorCalculationService {

    protected defaultColors: { [key: string]: string } = {
        green: '#00C851',
        orange: '#ffbb33',
        red: '#CC0000'
    };

    //from #ff0000 to array [255, 0, 0]
    private hexToRgb(hex: string): number[] {
        let red: number = parseInt(hex.substr(1, 2), 16),
            green: number = parseInt(hex.substr(3, 2), 16),
            blue: number = parseInt(hex.substr(5, 2), 16);
        return [red, green, blue];
    };


    private rgbToHex(red: number, green: number, blue: number): string {
        let redStr: string = Number(red).toString(16);
        let greenStr: string = Number(green).toString(16);
        let blueStr: string = Number(blue).toString(16);
        if (redStr.length < 2) {
            redStr = "0" + redStr;
        }
        if (greenStr.length < 2) {
            greenStr = "0" + greenStr;
        }
        if (blueStr.length < 2) {
            blueStr = "0" + blueStr;
        }
        return redStr + greenStr + blueStr;
    };

    public getBackgroundColor(availability: number): string {
        let currentAvailabilityInPercentFloat: number = Number((availability / 100).toFixed(3)),
            weight1: number = Number((1 - currentAvailabilityInPercentFloat).toFixed(3)),
            weight2: number = Number(currentAvailabilityInPercentFloat),
            colorFrom = this.hexToRgb(this.defaultColors['red']),
            colorTo = this.hexToRgb(this.defaultColors['orange']);

        if (availability >= 50) {
            colorFrom = this.hexToRgb(this.defaultColors['orange']);
            colorTo = this.hexToRgb(this.defaultColors['green']);
        }

        let colors = [
            Math.round(colorFrom[0] * weight1 + colorTo[0] * weight2),
            Math.round(colorFrom[1] * weight1 + colorTo[1] * weight2),
            Math.round(colorFrom[2] * weight1 + colorTo[2] * weight2)
        ];

        return '#' + this.rgbToHex(colors[0], colors[1], colors[2]);
    }
}