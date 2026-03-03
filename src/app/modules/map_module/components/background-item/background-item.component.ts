import {
    ChangeDetectionStrategy,
    Component,
    effect,
    input,
    InputSignal,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MapCanvasComponent } from '../map-canvas/map-canvas.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MapItemBaseComponent } from '../map-item-base/map-item-base.component';
import { Mapbackgrounditem } from '../../pages/mapeditors/mapeditors.interface';
import { MapItemType } from '../map-item-base/map-item-base.enum';
import { Subscription } from 'rxjs';
import { ResizableDirective } from '../../../../directives/resizable.directive';
import { NgStyle } from '@angular/common';

@Component({
    selector: 'oitc-background-item',
    standalone: true,
    imports: [CdkDrag, ContextMenuModule, CdkDragHandle, ResizableDirective, NgStyle],
    templateUrl: './background-item.component.html',
    styleUrl: './background-item.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackgroundItemComponent extends MapItemBaseComponent<Mapbackgrounditem> implements OnInit, OnDestroy {
    @ViewChild(ResizableDirective) resizableDirective!: ResizableDirective;

    public override item: InputSignal<Mapbackgrounditem | undefined> = input<Mapbackgrounditem>();
    public aspectRatioEnabled: InputSignal<boolean> = input<boolean>(false);

    private subscriptions: Subscription = new Subscription();

    protected override type = MapItemType.BACKGROUND;

    protected override isCopyable: boolean = false;

    protected init: boolean = true;
    protected width: number | undefined | null;
    protected height: number | undefined | null;

    protected invalidBackgroundMessage: string = this.TranslocoService.translate('{0} Map background image is not available!!!', {0: '⚠'});

    constructor(parent: MapCanvasComponent) {
        super(parent);
        effect(() => {
            this.updateBackgroundSizeAndPosition();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public ngOnInit(): void {

        this.init = false;
        this.updateBackgroundSizeAndPosition();
    }

    private updateBackgroundSizeAndPosition(): void {
        this.item()!.size_x = parseInt(this.item()!.size_x.toString(), 10);
        this.item()!.size_y = parseInt(this.item()!.size_y.toString(), 10);


        if (this.item()!.size_x > 0) {
            this.width = this.item()!.size_x;
        } else {
            this.width = null;
        }
        if (this.item()!.size_y > 0) {
            this.height = this.item()!.size_y;
        } else {
            this.height = null;
        }

        if (this.resizableDirective) {
            if (this.item()!.size_x > 0 && this.item()!.size_y > 0) {
                this.resizableDirective.setLastWidthHeight(this.item()!.size_x, this.item()!.size_y);
            } else {
                this.resizableDirective.setLastWidthHeightByHimself();
            }
        }
        this.cdr.markForCheck();
    }

    public getHeight(): number {
        let height = this.height;

        if (height == null) {
            height = this.containerRef.nativeElement.getBoundingClientRect().height;
        }

        return height;
    }

}
