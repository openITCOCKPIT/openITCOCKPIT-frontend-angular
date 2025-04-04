import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    effect,
    ElementRef,
    inject,
    input,
    InputSignal,
    OnInit,
    ViewChild
} from '@angular/core';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { MapItemType } from '../map-item-base/map-item-base.enum';
import { TranslocoService } from '@jsverse/transloco';
import { Helplines } from '../../pages/mapeditors/mapeditors.interface';
import { Map } from '../../pages/maps/maps.interface';
import { BackgroundItemComponent } from '../background-item/background-item.component';

@Component({
    selector: 'oitc-map-canvas',
    standalone: true,
    imports: [
        NgClass,
        NgIf,
        NgStyle
    ],
    templateUrl: './map-canvas.component.html',
    styleUrl: './map-canvas.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapCanvasComponent implements OnInit, AfterViewInit {
    @ViewChild('mapCanvasContainer', {static: true}) canvasContainerRef!: ElementRef<HTMLDivElement>;
    @ViewChild('backgroundImageContainer', {static: true}) backgroundImageRef!: ElementRef<HTMLDivElement>;
    @ContentChild(BackgroundItemComponent) backgroundItem!: BackgroundItemComponent;

    private cdr = inject(ChangeDetectorRef);
    private readonly TranslocoService = inject(TranslocoService);

    public helplines = input<Helplines>({enabled: true, size: 15});
    public map = input<Map | null | undefined>();
    public isViewMode: InputSignal<boolean> = input<boolean>(true);
    public isBackgroundEditMode: InputSignal<boolean> = input<boolean>(false);
    public currentDeletedItem: InputSignal<{ id: number, type: MapItemType } | undefined> = input<{
        id: number,
        type: MapItemType
    }>();

    protected backgroundWidth: number | undefined | null;
    protected backgroundHeight: number | undefined | null;
    protected canvasHeight: number | undefined | null;

    protected invalidBackgroundMessage: string = this.TranslocoService.translate('{0} Map background image is not available!!!', {0: '⚠'});

    constructor() {
        effect(() => {
            this.updateBackgroundSizeAndPosition();
            setTimeout(() => {
                this.setCanvasMinHeight();
            }, 400);
        });
    }

    public ngOnInit(): void {
        this.updateBackgroundSizeAndPosition();
    }

    public ngAfterViewInit(): void {
        setTimeout(() => {
            this.setCanvasMinHeight();
        }, 400);
    }

    public getHelplinesClass(): string {
        if (this.helplines().enabled) {
            return 'helplines' + this.helplines().size;
        }
        return '';
    };

    private setPosition(): void {
        if (this.map() && this.backgroundImageRef) {
            this.backgroundImageRef.nativeElement.style.left = `${this.map()!.background_x}px`;
            this.backgroundImageRef.nativeElement.style.top = `${this.map()!.background_y}px`;
        }
    }

    private updateBackgroundSizeAndPosition(): void {
        if (this.map()!.background_size_x! > 0) {
            this.backgroundWidth = this.map()!.background_size_x;
        } else {
            this.backgroundWidth = null;
        }
        if (this.map()!.background_size_y! > 0) {
            this.backgroundHeight = this.map()!.background_size_y;
        } else {
            this.backgroundHeight = null;
        }

        this.setPosition();
    }

    private setCanvasMinHeight(): void {
        this.canvasHeight = 600;
        //calculate canvas height based on background position
        if (this.canvasContainerRef) {

            const mapCanvas = this.canvasContainerRef.nativeElement.getBoundingClientRect();

            if (this.backgroundImageRef) {
                const background = this.backgroundImageRef.nativeElement.getBoundingClientRect();
                let backgroundHeight = background.height;

                // because the background image is hidden in edit mode
                if (this.isBackgroundEditMode() && this.backgroundItem) {
                    backgroundHeight = this.backgroundItem.getHeight();
                }

                let posY = background.y - mapCanvas.y;
                let height = posY + backgroundHeight + 11;

                if (height > 600) {
                    this.canvasHeight = height;
                }
            }

            this.canvasContainerRef.nativeElement.style.minHeight = `${this.canvasHeight}px`;
        }
    }

}
