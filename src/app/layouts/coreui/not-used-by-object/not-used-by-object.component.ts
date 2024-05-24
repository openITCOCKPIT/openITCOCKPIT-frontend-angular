import { Component } from '@angular/core';
import { ColComponent, ContainerComponent, RowComponent } from '@coreui/angular';
import { NgIf } from '@angular/common';

@Component({
    selector: 'oitc-not-used-by-object',
    standalone: true,
    imports: [
        ColComponent,
        NgIf,
        RowComponent,
        ContainerComponent
    ],
    templateUrl: './not-used-by-object.component.html',
    styleUrl: './not-used-by-object.component.css'
})
export class NotUsedByObjectComponent {

}
