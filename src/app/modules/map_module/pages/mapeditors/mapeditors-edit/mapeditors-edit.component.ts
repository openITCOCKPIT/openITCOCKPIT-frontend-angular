import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { GenericValidationError } from '../../../../../generic-responses';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { MapeditorsService } from '../Mapeditors.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HistoryService } from '../../../../../history.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapItemComponent } from '../../../components/map-item/map-item.component';
import { MapCanvasComponent } from '../../../components/map-canvas/map-canvas.component';
import { filter, parseInt } from 'lodash';
import { Background, Mapeditor, MapRoot, MaxUploadLimit, VisibleLayers } from '../Mapeditors.interface';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { ContextAction, MapitemBase } from '../../../components/map-item-base/map-item-base.interface';
import { MapTextComponent } from '../../../components/map-text/map-text.component';
import { MapIconComponent } from '../../../components/map-icon/map-icon.component';
import { MapLineComponent } from '../../../components/map-line/map-line.component';

@Component({
    selector: 'oitc-mapeditors-edit',
    standalone: true,
    imports: [
        FaIconComponent,
        PermissionDirective,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        BackButtonDirective,
        XsButtonDirective,
        CardBodyComponent,
        RouterLink,
        TranslocoDirective,
        FFlowModule,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormsModule,
        DropdownComponent,
        DropdownToggleDirective,
        DropdownMenuDirective,
        DropdownItemDirective,
        NgForOf,
        NgIf,
        MapItemComponent,
        MapCanvasComponent,
        NgClass,
        CdkDrag,
        CdkDragHandle,
        MapTextComponent,
        MapIconComponent,
        MapLineComponent
    ],
    templateUrl: './mapeditors-edit.component.html',
    styleUrl: './mapeditors-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapeditorsEditComponent implements OnInit, OnDestroy {

    @ViewChild(FCanvasComponent, {static: true})
    public fCanvasComponent!: FCanvasComponent;

    private subscriptions: Subscription = new Subscription();
    private MapeditorsService: MapeditorsService = inject(MapeditorsService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private route = inject(ActivatedRoute);
    public errors: GenericValidationError = {} as GenericValidationError;
    private cdr = inject(ChangeDetectorRef);

    public init = true;
    protected mapId: number = 0;
    public map!: MapRoot;
    protected helplineSizes: number[] = [5, 10, 15, 20, 25, 30, 50, 80];
    protected gridSizes = [5, 10, 15, 20, 25, 30, 50, 80];
    public gridSize: { x: number, y: number } = {x: 25, y: 25};

    public backgrounds: Background[] = [];
    public lastBackgroundImageToDeletePreventForSave = null;

    public layers: string[] = [];
    public currentBackground: string = '';

    public addNewObject = false;
    public action: string | null = null;

    public currentItem = {};
    public maxZIndex = 0;
    public clickCount = 1;

    public brokenImageDetected = false;

    public Mapeditor: Mapeditor = {
        grid: {
            enabled: true,
            size: 15
        },
        helplines: {
            enabled: true,
            size: 15
        },
        synchronizeGridAndHelplinesSize: true

    };

    public addLink = false;

    public uploadIconSet = false;

    public defaultLayer = '0';

    public visibleLayers: VisibleLayers = {};

    public maxUploadLimit!: MaxUploadLimit;

    public ngOnInit(): void {
        this.mapId = Number(this.route.snapshot.paramMap.get('id'));
        this.load();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load(): void {
        this.subscriptions.add(this.MapeditorsService.getEdit(this.mapId)
            .subscribe((result) => {
                this.map = result.map;
                this.Mapeditor = result.config.Mapeditor;
                this.maxUploadLimit = result.maxUploadLimit;
                this.maxZIndex = result.max_z_index;
                this.layers = result.layers;

                for (var k in this.layers) {
                    this.visibleLayers['layer_' + k] = true;
                }

                this.currentBackground = this.map.Map.background;

                if (this.init) {
                    /*createDropzones();
                    loadBackgroundImages();

                    setTimeout(makeDraggable, 250);*/
                }

                this.init = false;
                this.changeGridSize(this.Mapeditor.grid.size);
                this.cdr.markForCheck();
            }));
    }

    public onDropItem(mapItem: MapitemBase) {
        console.error("Item dropped", mapItem);
    }

    public changeGridSize(size: number) {
        this.Mapeditor.grid.size = parseInt(size.toString(), 10);
        if (this.Mapeditor.synchronizeGridAndHelplinesSize) {
            if (this.Mapeditor.grid.size != this.Mapeditor.helplines.size) {
                this.changeHelplinesSize(this.Mapeditor.grid.size);
            }
        }
        //if (this.Mapeditor.grid.enabled) {
        this.gridSize = {x: size, y: size};
        this.cdr.markForCheck();
        //makeDraggable();
        //}
    }

    public changeHelplinesSize(size: number) {
        this.Mapeditor.helplines.size = parseInt(size.toString(), 10);
        if (this.Mapeditor.synchronizeGridAndHelplinesSize) {
            if (this.Mapeditor.grid.size != this.Mapeditor.helplines.size) {
                this.changeGridSize(this.Mapeditor.helplines.size);
            }
        }
        this.onHelplinesChange();
    }

    public onHelplinesChange() {
        this.Mapeditor.helplines = {...this.Mapeditor.helplines};
        this.cdr.markForCheck();
    }

    public onItemChange(objectName: keyof MapRoot) {
        this.map[objectName] = [...this.map[objectName]];
        this.cdr.markForCheck();
    }

    public setDefaultLayer(layerNo: number) {
        this.defaultLayer = layerNo.toString();
        this.cdr.markForCheck();
    }

    public hideLayer(key: number) {
        let keyAsString = key.toString();
        this.visibleLayers['layer_' + keyAsString] = false;

        let objectsToHide = [
            'Mapitems',
            'Maplines',
            'Mapgadgets',
            'Mapicons',
            'Maptexts',
            'Mapsummaryitems'
        ];
        for (let arrayKey in objectsToHide) {
            let objectName = objectsToHide[arrayKey];
            if (this.map.hasOwnProperty(objectName)) {
                for (let i in this.map[objectName as keyof MapRoot]) {
                    if (this.map[objectName as keyof MapRoot][i].z_index === keyAsString) {
                        this.map[objectName as keyof MapRoot][i].display = false;
                        this.onItemChange(objectName);
                    }
                }
            }
        }
    }

    public showLayer(key: number) {
        let keyAsString = key.toString();
        this.visibleLayers['layer_' + keyAsString] = true;

        let objectsToHide = [
            'Mapitems',
            'Maplines',
            'Mapgadgets',
            'Mapicons',
            'Maptexts',
            'Mapsummaryitems'
        ];
        for (let arrayKey in objectsToHide) {
            let objectName = objectsToHide[arrayKey];
            if (this.map.hasOwnProperty(objectName)) {
                for (let i in this.map[objectName as keyof MapRoot]) {
                    if (this.map[objectName as keyof MapRoot][i].z_index === keyAsString) {
                        this.map[objectName as keyof MapRoot][i].display = true;
                        this.onItemChange(objectName);
                    }
                }
            }
        }
    };

    public onContextAction($event: ContextAction) {
        const type = $event.type;
        let index;
        console.error('ContextAction', $event);
        if (type === 'labelPosition') {
            for (let i = 0; i < this.map.Mapitems.length; i++) {
                if (this.map.Mapitems[i].id === $event.data.id) {
                    let data = $event.data as any;
                    this.map.Mapitems[i].label_possition = data.label_possition!;
                    index = i;
                    break;
                }
            }
        }
        if (type === 'Edit') {
            console.error('Edit');
        }
        if (type === 'Delete') {
            console.error('Delete');
        }
        if (index !== undefined) {
            this.map.Mapitems[index] = {...this.map.Mapitems[index]};
            this.cdr.markForCheck();
        }
    }

    public addItem() {

        const options = {
            timeOut: 3500,
            progressBar: true,
            enableHtml: true,
            positionClass: 'toast-top-center'
        }
        this.notyService.noty('Click at the position on the map, where you want to create a new object.', 'info', options, '');
        //$('#map-editor').css('cursor', 'crosshair');
        this.addNewObject = true;
        this.action = 'item';
        this.cdr.markForCheck();
    };

    public addLine() {
        const options = {
            timeOut: 3500,
            progressBar: true,
            enableHtml: true,
            positionClass: 'toast-top-center'
        }
        this.notyService.noty('Click at the position on the map, where the line should start.', 'info', options, '');
        this.clickCount = 1;
        //$('#map-editor').css('cursor', 'crosshair');
        this.addNewObject = true;
        this.action = 'line';
        this.cdr.markForCheck();
    };

    public addSummaryItem() {
        const options = {
            timeOut: 3500,
            progressBar: true,
            enableHtml: true,
            positionClass: 'toast-top-center'
        }
        this.notyService.noty('Click at the position on the map, where you want to create a new status summary icon', 'info', options, '');
        //$('#map-editor').css('cursor', 'crosshair');
        this.addNewObject = true;
        this.action = 'summaryItem';
        this.cdr.markForCheck();
    };

    public addGadget() {
        const options = {
            timeOut: 3500,
            progressBar: true,
            enableHtml: true,
            positionClass: 'toast-top-center'
        }
        this.notyService.noty('Click at the position on the map, where you want to place the new Gadget.', 'info', options, '');
        //$('#map-editor').css('cursor', 'crosshair');
        this.addNewObject = true;
        this.action = 'gadget';
        this.cdr.markForCheck();
    };

    public openChangeMapBackgroundModal() {
        if (this.map.Map.background !== null && this.map.Map.background.length > 0) {
            if (this.backgrounds.length === 0) {
                this.brokenImageDetected = true;
            } else {
                this.brokenImageDetected = filter(
                    this.backgrounds, (background) => background.image === this.map.Map.background).length === 0;
            }
        }

        //$('#changeBackgroundModal').modal('show');
        this.cdr.markForCheck();
    };

    public addText() {
        const options = {
            timeOut: 3500,
            progressBar: true,
            enableHtml: true,
            positionClass: 'toast-top-center'
        }
        this.notyService.noty('Click at the position on the map, where you want to create new text', 'info', options, '');
        //$('#map-editor').css('cursor', 'crosshair');
        this.addNewObject = true;
        this.action = 'text';
        this.addLink = false;
        //$('#docuText').val('');
        this.cdr.markForCheck();
    };

    public addIcon() {
        const options = {
            timeOut: 3500,
            progressBar: true,
            enableHtml: true,
            positionClass: 'toast-top-center'
        }
        this.notyService.noty('Click at the position on the map, where you want to create a new icon', 'info', options, '');
        //$('#map-editor').css('cursor', 'crosshair');
        this.addNewObject = true;
        this.action = 'icon';
        this.cdr.markForCheck();
    };

    protected readonly parseInt = parseInt;
}
