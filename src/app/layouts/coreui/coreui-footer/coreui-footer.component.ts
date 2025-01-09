import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FooterComponent } from '@coreui/angular';

@Component({
    selector: 'oitc-coreui-footer',
    imports: [],
    templateUrl: './coreui-footer.component.html',
    styleUrl: './coreui-footer.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreuiFooterComponent extends FooterComponent {

    private cdr = inject(ChangeDetectorRef);

    constructor() {
        super();
    }
}
