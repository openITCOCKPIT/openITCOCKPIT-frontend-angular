import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { MapCanvasComponent } from '../map-canvas/map-canvas.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MapItemBaseComponent } from '../map-item-base/map-item-base.component';
import { Mapicon } from '../../pages/mapeditors/Mapeditors.interface';
import { MapItemType } from '../map-item-base/map-item-base.enum';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'oitc-map-icon',
    standalone: true,
    imports: [CdkDrag, ContextMenuModule, NgIf, NgClass],
    templateUrl: './map-icon.component.html',
    styleUrl: './map-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapIconComponent extends MapItemBaseComponent<Mapicon> {

    public override item: InputSignal<Mapicon | undefined> = input<Mapicon>();
    protected override type = MapItemType.ICON;

    constructor(parent: MapCanvasComponent) {
        super(parent);
    }

}
