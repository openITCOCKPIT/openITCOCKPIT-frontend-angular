import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FExternalItem } from '@foblex/flow';
import { TranslocoDirective } from '@jsverse/transloco';
import { ContainerTypesEnum } from '../../../changelogs/object-types.enum';

@Component({
    selector: 'oitc-nodes-palette',
    imports: [
        FaIconComponent,
        FExternalItem,
        TranslocoDirective
    ],
    templateUrl: './nodes-palette.component.html',
    styleUrl: './nodes-palette.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodesPaletteComponent {

    protected readonly ContainerTypesEnum = ContainerTypesEnum;
}
