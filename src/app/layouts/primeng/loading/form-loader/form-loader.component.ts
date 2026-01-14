import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { TitleService } from '../../../../services/title.service';


@Component({
    selector: 'oitc-form-loader',
    imports: [
    SkeletonModule
],
    templateUrl: './form-loader.component.html',
    styleUrl: './form-loader.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})

// This loader mimics the optic of a generic form that is loading data
export class FormLoaderComponent implements OnChanges {
    @Input() isVisible: boolean = false;

    private readonly TitleService: TitleService = inject(TitleService);

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['isVisible']) {
            this.TitleService.setTitle();
        }
    }
}
