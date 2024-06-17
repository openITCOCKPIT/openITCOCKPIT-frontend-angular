import {Component } from '@angular/core';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {ColComponent, ContainerComponent, PopoverDirective, RowComponent} from '@coreui/angular';
import {TranslocoDirective} from '@jsverse/transloco';
import {NgClass} from '@angular/common';

@Component({
    selector: 'oitc-regex-helper-tooltip',
    standalone: true,
    imports: [
        FaIconComponent,
        PopoverDirective,
        TranslocoDirective,
        RowComponent,
        ColComponent,
        ContainerComponent,
        NgClass,

    ],
    templateUrl: './regex-helper-tooltip.component.html',
    styleUrl: './regex-helper-tooltip.component.css',
   // encapsulation: ViewEncapsulation.Emulated,
})
export class RegexHelperTooltipComponent {
    public light: boolean = false

    lightSwitch (){
        this.light = !this.light;
    }

}
