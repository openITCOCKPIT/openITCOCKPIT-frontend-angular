import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
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
export class MapCanvasComponent implements OnInit {
    @ViewChild('mapCanvasContainer', {static: true}) canvasContainerRef!: ElementRef<HTMLDivElement>;
    @ViewChild('backgroundImageContainer', {static: true}) backgroundImageRef!: ElementRef<HTMLDivElement>;

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

    protected width: number | undefined | null;
    protected height: number | undefined | null;

    protected invalidBackgroundMessage: string = this.TranslocoService.translate('{0} Map background image is not available!!!', {0: '⚠'});

    constructor() {
        effect(() => {
            this.updateBackgroundSizeAndPosition();
        });
    }

    public ngOnInit(): void {
        this.updateBackgroundSizeAndPosition();
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
            this.width = this.map()!.background_size_x;
        } else {
            this.width = null;
        }
        if (this.map()!.background_size_y! > 0) {
            this.height = this.map()!.background_size_y;
        } else {
            this.height = null;
        }

        this.setPosition();
    }

}
