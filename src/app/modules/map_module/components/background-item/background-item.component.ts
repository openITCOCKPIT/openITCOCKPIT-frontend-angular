import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
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
import { AngularDraggableModule } from 'angular2-draggable';

@Component({
    selector: 'oitc-background-item',
    standalone: true,
    imports: [CdkDrag, ContextMenuModule, CdkDragHandle, AngularDraggableModule],
    templateUrl: './background-item.component.html',
    styleUrl: './background-item.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackgroundItemComponent extends MapItemBaseComponent<Mapbackgrounditem> implements OnInit, OnDestroy, AfterViewInit {

    public override item: InputSignal<Mapbackgrounditem | undefined> = input<Mapbackgrounditem>();
    public aspectRatioEnabled: InputSignal<boolean> = input<boolean>(false);
    @ViewChild('backgroundImage', {static: false}) backgroundImageRef!: ElementRef<HTMLImageElement>;

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


    public ngOnInit(): void {

        this.init = false;
        //this.updateBackgroundSizeAndPosition();
    }

    public override ngAfterViewInit(): void {
        super.ngAfterViewInit();

        let width, height = 0;
        const img = this.backgroundImageRef.nativeElement;
        if (img.complete) {
            // Image already loaded
            width = img.naturalWidth;
            height = img.naturalHeight;

            const item = this.item();
            if (item && item?.size_x > 0) {
                // User has defined a width
                this.width = Number(item?.size_x);
            } else {
                // Use image width
                this.width = width;
            }

            if (item && item?.size_y > 0) {
                // User has defined a height
                this.width = Number(item?.size_y);
            } else {
                // Use image width
                this.height = height;
            }

        } else {
            img.onload = () => {
                width = img.naturalWidth;
                height = img.naturalHeight;

                const item = this.item();
                if (item && item?.size_x > 0) {
                    // User has defined a width
                    this.width = Number(item?.size_x);
                } else {
                    // Use image width
                    this.width = width;
                }

                if (item && item?.size_y > 0) {
                    // User has defined a height
                    this.height = Number(item?.size_y);
                } else {
                    // Use image width
                    this.height = height;
                }
            };
        }


        /*
        this.backgroundImageRef.nativeElement.onload = () => {
            const width = this.backgroundImageRef.nativeElement.offsetWidth;
            const height = this.backgroundImageRef.nativeElement.offsetHeight;
            console.log({w: width, h: height});
            console.log(this.width);
            console.log(this.height);
        };*/
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private updateBackgroundSizeAndPosition(): void {
        const width = Number(this.item()?.size_x);
        const height = Number(this.item()?.size_y);

        this.width = null;
        this.height = null;

        if (width > 0) {
            this.width = width;
        }

        if (height > 0) {
            this.height = height;
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
