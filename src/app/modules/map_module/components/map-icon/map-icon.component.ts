import { ChangeDetectionStrategy, Component, effect, input, InputSignal } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { MapCanvasComponent } from '../map-canvas/map-canvas.component';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MapItemBaseComponent } from '../map-item-base/map-item-base.component';
import { Mapicon } from '../../pages/mapeditors/Mapeditors.interface';
import { TrustAsHtmlPipe } from '../../../../pipes/trust-as-html.pipe';

@Component({
    selector: 'oitc-map-icon',
    standalone: true,
    imports: [CdkDrag, NgClass, ContextMenuModule, NgIf, NgStyle, TrustAsHtmlPipe],
    templateUrl: './map-icon.component.html',
    styleUrl: './map-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapIconComponent extends MapItemBaseComponent<Mapicon> {

    public override item: InputSignal<Mapicon | undefined> = input<Mapicon>();

    constructor(parent: MapCanvasComponent) {
        super(parent);
        effect(() => {
            this.id = this.item()!.id;
            this.mapId = this.item()!.map_id;
            this.x = this.item()!.x;
            this.y = this.item()!.y;
            this.zIndex = this.item()!.z_index!;
            this.setPosition();
            this.setLayer(this.zIndex);
        });
    }

}
