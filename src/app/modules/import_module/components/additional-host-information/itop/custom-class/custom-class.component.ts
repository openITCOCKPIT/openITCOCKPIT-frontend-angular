import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../ExternalSystems.interface';
import { FaIconComponent, FaLayersComponent } from '@fortawesome/angular-fontawesome';
import { TableDirective } from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { JsonPipe, KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { CustomClassInformationComponent } from './custom-class-information/custom-class-information.component';


@Component({
    selector: 'oitc-custom-class',
    standalone: true,
    imports: [
        FaIconComponent,
        FaLayersComponent,
        TableDirective,
        TranslocoDirective,
        NgIf,
        NgForOf,
        KeyValuePipe,
        JsonPipe,
        CustomClassInformationComponent
    ],
    templateUrl: './custom-class.component.html',
    styleUrl: './custom-class.component.css'
})
export class CustomClassComponent {
    @Input() result!: AdditionalHostInformationResult;
    protected readonly keepOrder = keepOrder;
}

const keepOrder = (a: any, b: any) => a;

// This pipe uses the angular keyvalue pipe. but doesn't change order.
@Pipe({
    standalone: true,
    name: 'defaultOrderKeyvalue'
})
export class DefaultOrderKeyValuePipe extends KeyValuePipe implements PipeTransform {

    override transform(value: any, ...args: any[]): any {
        return super.transform(value, keepOrder);
    }

}
