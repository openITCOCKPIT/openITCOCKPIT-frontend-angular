import { TranslocoService } from '@jsverse/transloco';

export interface GrafanaColor {
    key: string,        // green
    name: string        // Green (human)
    main: string,       // rgb(86, 166, 75)  (mother of all greens)
    children: string[]  // other greens
}

export class GrafanaColors {

    private readonly TranslocoService?: TranslocoService;
    private colors: GrafanaColor[] = [];

    constructor(TranslocoService: TranslocoService) {
        this.TranslocoService = TranslocoService;

        this.colors = [
            {
                key: 'green',
                name: this.TranslocoService.translate('Green'),
                main: 'rgb(86, 166, 75)',
                children: [
                    'rgb(25, 115, 14)',
                    'rgb(55, 135, 45)',
                    'rgb(115, 191, 105)',
                    'rgb(150, 217, 141)'
                ]
            },
            {
                key: 'yellow',
                name: this.TranslocoService.translate('Yellow'),
                main: 'rgb(242, 204, 12)',
                children: [
                    'rgb(204, 157, 0)',
                    'rgb(224, 180, 0)',
                    'rgb(250, 222, 42)',
                    'rgb(255, 238, 82)'
                ]
            },
            {
                key: 'red',
                name: this.TranslocoService.translate('Red'),
                main: 'rgb(224, 47, 68)',
                children: [
                    'rgb(173, 3, 23)',
                    'rgb(196, 22, 42)',
                    'rgb(242, 73, 92)',
                    'rgb(255, 115, 131)'
                ]
            },
            {
                key: 'blue',
                name: this.TranslocoService.translate('Blue'),
                main: 'rgb(50, 116, 217)',
                children: [
                    'rgb(18, 80, 176)',
                    'rgb(31, 96, 196)',
                    'rgb(87, 148, 242)',
                    'rgb(138, 184, 255)'
                ]
            },
            {
                key: 'orange',
                name: this.TranslocoService.translate('Orange'),
                main: 'rgb(255, 120, 10)',
                children: [
                    'rgb(229, 84, 0)',
                    'rgb(250, 100, 0)',
                    'rgb(255, 152, 48)',
                    'rgb(225, 179, 87)'
                ]
            },
            {
                key: 'purple',
                name: this.TranslocoService.translate('Purple'),
                main: 'rgb(163, 82, 204)',
                children: [
                    'rgb(124, 46, 163)',
                    'rgb(143, 59, 184)',
                    'rgb(184, 119, 217)',
                    'rgb(202, 149, 229)'
                ]
            },
        ];
    }

    public getColors(): GrafanaColor[] {
        return this.colors;
    }


}
