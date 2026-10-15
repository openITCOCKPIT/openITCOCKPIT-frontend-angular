import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ColComponent, RowComponent } from '@coreui/angular';
import { Skeleton } from '@openng/optimus-ui/skeleton';

@Component({
    selector: 'oitc-operations-summary-loader',
    imports: [
        ColComponent,
        RowComponent,
        Skeleton
    ],
    templateUrl: './operations-summary-loader.component.html',
    styleUrl: './operations-summary-loader.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperationsSummaryLoaderComponent {
}
