import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';


@Component({
    selector: 'oitc-ng-select-select-all',
    standalone: true,
    imports: [
        FormsModule,
        TranslocoDirective
    ],
    templateUrl: './ng-select-select-all.component.html',
    styleUrl: './ng-select-select-all.component.css'
})
export class NgSelectSelectAllComponent {
    @Input() item: any;
    @Input() item$: any;
    @Input() index!: number;
}
