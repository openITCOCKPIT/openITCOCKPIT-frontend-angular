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
import { KeyValuePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapItemComponent } from '../../../components/map-item/map-item.component';
import { MapCanvasComponent } from '../../../components/map-canvas/map-canvas.component';
import { filter, parseInt } from 'lodash';
import { Background, Mapeditor, MapRoot, MaxUploadLimit, VisibleLayers } from '../Mapeditors.interface';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { ContextAction, MapitemBaseActionObject } from '../../../components/map-item-base/map-item-base.interface';
import { MapTextComponent } from '../../../components/map-text/map-text.component';
import { MapIconComponent } from '../../../components/map-icon/map-icon.component';
import { MapLineComponent } from '../../../components/map-line/map-line.component';
import { MapItemType } from '../../../components/map-item-base/map-item-base.enum';
import { MapSummaryItemComponent } from '../../../components/map-summary-item/map-summary-item.component';

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
        MapLineComponent,
        KeyValuePipe,
        MapSummaryItemComponent
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

    public currentItem: any = {};
    public currentDeletedItem: {
        id: number
        type: MapItemType
    } | undefined; // to disable effect() after item delete
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

    constructor() {
        this.deleteItem = this.deleteItem.bind(this);
        this.deleteIcon = this.deleteIcon.bind(this);
        this.deleteLine = this.deleteLine.bind(this);
        this.deleteText = this.deleteText.bind(this);
        this.deleteSummaryItem = this.deleteSummaryItem.bind(this);
        this.saveItem = this.saveItem.bind(this);
        this.saveIcon = this.saveIcon.bind(this);
        this.saveLine = this.saveLine.bind(this);
        this.saveText = this.saveText.bind(this);
        this.saveSummaryItem = this.saveSummaryItem.bind(this);
    }

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

                for (let k in this.layers) {
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

    public onDropItem(item: MapitemBaseActionObject) {

        let x = item.data.x;
        let y = item.data.y;
        let id = item.data.id;
        let type = item.type;

        switch (type) {
            case MapItemType.ITEM:
                this.currentItem = {
                    id: id,
                    x: x,
                    y: y
                };
                this.saveItem('dragstop');
                break;

            case MapItemType.LINE:
                x = item.data.startX!;
                y = item.data.startY!;

                let endX = item.data.endX;
                let endY = item.data.endY;

                this.currentItem = {
                    id: id,
                    startX: x,
                    startY: y,
                    endX: endX,
                    endY: endY
                };

                this.saveLine('dragstop');
                break;

            case MapItemType.GADGET:
                this.currentItem = {
                    id: id,
                    x: x,
                    y: y
                };
                //this.saveGadget('dragstop');
                break;

            case MapItemType.TEXT:
                this.currentItem = {
                    id: id,
                    x: x,
                    y: y
                };
                this.saveText('dragstop');
                break;

            case MapItemType.ICON:
                this.currentItem = {
                    id: id,
                    x: x,
                    y: y
                };
                this.saveIcon('dragstop');
                break;

            case MapItemType.SUMMARYITEM:
                this.currentItem = {
                    id: id,
                    x: x,
                    y: y
                };
                this.saveSummaryItem('dragstop');
                break;

            default:
                console.log('Unknown map object type');
                this.notyService.genericError();
        }
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
        this.onMapeditorChange();
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
        this.onMapeditorChange();
        this.cdr.markForCheck();
    }

    public onItemChange(objectName: keyof MapRoot) {
        this.map[objectName] = [...this.map[objectName]];
        this.cdr.markForCheck();
    }

    public onSynchronizeGridAndHelplinesSize(isEnabled: boolean) {
        this.Mapeditor.synchronizeGridAndHelplinesSize = isEnabled;
        this.onMapeditorChange();
        this.cdr.markForCheck();
    }

    public onGridEnabledChange() {
        this.onMapeditorChange();
        this.cdr.markForCheck();
    }

    public onMapeditorChange() {
        if (this.init) {
            return;
        }
        this.saveMapeditorSettings();
    }

    public setDefaultLayer(layerNo: string) {
        this.defaultLayer = layerNo;
        this.cdr.markForCheck();
    }

    public hideLayer(key: string) {
        this.visibleLayers['layer_' + key] = false;

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
                    if (this.map[objectName as keyof MapRoot][i].z_index === key) {
                        this.map[objectName as keyof MapRoot][i].display = false;
                        this.onItemChange(objectName);
                    }
                }
            }
        }
    }

    public showLayer(key: string) {
        this.visibleLayers['layer_' + key] = true;

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
                    if (this.map[objectName as keyof MapRoot][i].z_index === key) {
                        this.map[objectName as keyof MapRoot][i].display = true;
                        this.onItemChange(objectName);
                    }
                }
            }
        }
    };

    public onContextAction($event: ContextAction) {
        const type = $event.type;
        if (type === 'labelPosition') {
            this.changeLabelPositionFromContextMenu($event, MapItemType.ITEM, 'Mapitems', this.saveItem);
            this.changeLabelPositionFromContextMenu($event, MapItemType.SUMMARYITEM, 'Mapsummaryitems', this.saveSummaryItem);
        }
        if (type === 'edit') {
            console.error('Edit');
        }
        if (type === 'layer') {
            this.changeLayerFromContextMenu($event, MapItemType.ITEM, 'Mapitems', this.saveItem);
            this.changeLayerFromContextMenu($event, MapItemType.TEXT, 'Maptexts', this.saveText);
            this.changeLayerFromContextMenu($event, MapItemType.ICON, 'Mapicons', this.saveIcon);
            this.changeLayerFromContextMenu($event, MapItemType.LINE, 'Maplines', this.saveLine);
            this.changeLayerFromContextMenu($event, MapItemType.SUMMARYITEM, 'Mapsummaryitems', this.saveSummaryItem);
        }
        if (type === 'delete') {
            this.deleteFromContextMenu($event, MapItemType.ITEM, 'Mapitems', this.deleteItem);
            this.deleteFromContextMenu($event, MapItemType.TEXT, 'Maptexts', this.deleteText);
            this.deleteFromContextMenu($event, MapItemType.ICON, 'Mapicons', this.deleteIcon);
            this.deleteFromContextMenu($event, MapItemType.LINE, 'Maplines', this.deleteLine);
            this.deleteFromContextMenu($event, MapItemType.SUMMARYITEM, 'Mapsummaryitems', this.deleteSummaryItem);
        }
    }

    private changeLabelPositionFromContextMenu(event: ContextAction, itemType: MapItemType, objectName: keyof MapRoot, saveMethod: (action: string) => void) {
        let items = this.map[objectName];
        if (event.itemType === itemType && items && Array.isArray(items) && items.length > 0) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].id === event.data.id) {
                    let data = event.data as any;
                    items[i].label_possition = data.label_possition!;
                    items[i] = {...items[i]};

                    this.currentItem = items[i];
                    saveMethod('add_or_edit');
                    this.cdr.markForCheck();
                    break;
                }
            }
        }
    }

    private changeLayerFromContextMenu(event: ContextAction, itemType: MapItemType, objectName: keyof MapRoot, saveMethod: (action: string) => void) {
        let items = this.map[objectName];
        if (event.itemType === itemType && items && Array.isArray(items) && items.length > 0) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].id === event.data.id) {
                    let data = event.data as any;
                    items[i].z_index = data.z_index!;
                    items[i] = {...items[i]};
                    this.currentItem = items[i];
                    saveMethod('add_or_edit');
                    this.cdr.markForCheck();
                    break;
                }
            }
        }
    }

    private deleteFromContextMenu(event: ContextAction, itemType: MapItemType, objectName: keyof MapRoot, deleteMethod: () => void) {
        let items = this.map[objectName];
        if (event.itemType === itemType && items && Array.isArray(items) && items.length > 0) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].id === event.data.id) {
                    this.currentItem = items[i];
                    deleteMethod();
                    break;
                }
            }
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

    public editItem(item: any) {
        this.action = 'item';
        this.currentItem = item;
        //$('#addEditMapItemModal').modal('show');
        this.cdr.markForCheck();
    };

    public saveItem(action: string) {
        if (typeof action === 'undefined') {
            action = 'add_or_edit';
        }

        this.currentItem.map_id = this.mapId.toString();

        this.subscriptions.add(this.MapeditorsService.saveItem({
            'Mapitem': this.currentItem,
            'action': action
        }).subscribe((result) => {
            this.cdr.markForCheck();
            if (result.success) {
                const title = this.TranslocoService.translate('Data');
                const msg = this.TranslocoService.translate('saved successfully');

                //Update possition in current scope json data
                if (this.currentItem.hasOwnProperty('id')) {
                    for (let i in this.map.Mapitems) {
                        if (this.map.Mapitems[i].id == this.currentItem.id) {
                            this.map.Mapitems[i].x = this.currentItem.x;
                            this.map.Mapitems[i].y = this.currentItem.y;

                            //We are done here
                            break;
                        }
                    }
                } else {
                    //New created item
                    if (typeof this.map.Mapitems === "undefined") {
                        this.map.Mapitems = [];
                    }
                    this.map.Mapitems.push(result.data.Mapitem.Mapitem);
                    //setTimeout(makeDraggable, 250);
                }

                //$('#addEditMapItemModal').modal('hide');
                this.notyService.genericSuccess(msg, title);
                return;
            }

            // Error
            const errorResponse = result.data as GenericValidationError;
            this.notyService.genericError();
            if (result) {
                this.errors = errorResponse;

            }
        }));
    };

    public deleteItem() {
        this.currentItem.map_id = this.mapId;

        this.currentDeletedItem = {
            id: this.currentItem.id,
            type: MapItemType.ITEM
        }

        this.subscriptions.add(this.MapeditorsService.deleteItem({
            'Mapitem': this.currentItem,
            'action': 'delete'
        }).subscribe((result) => {
            this.cdr.markForCheck();
            if (result.success) {
                const title = this.TranslocoService.translate('Data');
                const msg = this.TranslocoService.translate('saved successfully');

                //Remove item from current scope
                for (let i in this.map.Mapitems) {
                    if (this.map.Mapitems[i].id == this.currentItem.id) {
                        this.map.Mapitems.splice(Number(i), 1);

                        //We are done here
                        break;
                    }
                }

                this.notyService.genericSuccess(msg, title);
                //$('#addEditMapItemModal').modal('hide');
                this.currentItem = {};
                delete this.currentDeletedItem;
                return;
            }

            // Error
            const errorResponse = result.data as GenericValidationError;
            this.notyService.genericError();
            if (result) {
                delete this.currentDeletedItem;
                this.errors = errorResponse;

            }
        }));
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

    public editLine(lineItem: any) {
        this.action = 'line';
        this.currentItem = lineItem;
        //$('#addEditMapLineModal').modal('show');
    };

    public saveLine(action: string) {
        if (typeof action === 'undefined') {
            action = 'add_or_edit';
        }

        this.currentItem.map_id = this.mapId.toString();

        if (this.currentItem.type === 'stateless') {
            this.currentItem.object_id = null;
        }


        this.subscriptions.add(this.MapeditorsService.saveLine({
            'Mapline': this.currentItem,
            'action': action
        }).subscribe((result) => {
            this.cdr.markForCheck();
            if (result.success) {
                const title = this.TranslocoService.translate('Data');
                const msg = this.TranslocoService.translate('saved successfully');

                //Update possition in current scope json data
                if (this.currentItem.hasOwnProperty('id')) {
                    for (let i in this.map.Maplines) {
                        if (this.map.Maplines[i].id == this.currentItem.id) {
                            this.map.Maplines[i].startY = this.currentItem.startY;
                            this.map.Maplines[i].endX = this.currentItem.endX;
                            this.map.Maplines[i].endY = this.currentItem.endY;
                            this.map.Maplines[i].startX = this.currentItem.startX; //Change this last because of $watch in directive

                            //We are done here
                            break;
                        }
                    }
                } else {
                    //New created item
                    if (typeof this.map.Maplines === "undefined") {
                        this.map.Maplines = [];
                    }

                    this.map.Maplines.push(result.data.Mapline.Mapline);
                    //setTimeout(makeDraggable, 250);
                }

                //$('#addEditMapLineModal').modal('hide');
                this.notyService.genericSuccess(msg, title);
                return;
            }

            // Error
            const errorResponse = result.data as GenericValidationError;
            this.notyService.genericError();
            if (result) {
                this.errors = errorResponse;

            }
        }));
    };

    public deleteLine() {
        this.currentItem.map_id = this.mapId;

        this.currentDeletedItem = {
            id: this.currentItem.id,
            type: MapItemType.LINE
        }

        this.subscriptions.add(this.MapeditorsService.deleteLine({
            'Mapline': this.currentItem,
            'action': 'delete'
        }).subscribe((result) => {
            this.cdr.markForCheck();
            if (result.success) {
                const title = this.TranslocoService.translate('Data');
                const msg = this.TranslocoService.translate('saved successfully');

                //Remove item from current scope
                for (let i in this.map.Maplines) {
                    if (this.map.Maplines[i].id == this.currentItem.id) {
                        this.map.Maplines.splice(Number(i), 1);

                        //We are done here
                        break;
                    }
                }

                this.notyService.genericSuccess(msg, title);
                //$('#addEditMapLineModal').modal('hide');
                this.currentItem = {};
                delete this.currentDeletedItem;
                return;
            }

            // Error
            const errorResponse = result.data as GenericValidationError;
            this.notyService.genericError();
            if (result) {
                delete this.currentDeletedItem;
                this.errors = errorResponse;

            }
        }));
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

    public editSummaryItem(item: any) {
        this.action = 'summaryItem';
        this.currentItem = item;
        //$('#addEditSummaryItemModal').modal('show');
    };

    public saveSummaryItem(action: string) {
        if (typeof action === 'undefined') {
            action = 'add_or_edit';
        }

        this.currentItem.map_id = this.mapId.toString();

        this.subscriptions.add(this.MapeditorsService.saveSummaryItem({
            'Mapsummaryitem': this.currentItem,
            'action': action
        }).subscribe((result) => {
            this.cdr.markForCheck();
            if (result.success) {
                const title = this.TranslocoService.translate('Data');
                const msg = this.TranslocoService.translate('saved successfully');

                if (action === 'resizestop') {
                    this.notyService.genericSuccess(msg, title);
                    //Nothing needs to be updated
                    return;
                }

                //Update possition in current scope json data
                if (this.currentItem.hasOwnProperty('id')) {
                    for (let i in this.map.Mapsummaryitems) {
                        if (this.map.Mapsummaryitems[i].id == this.currentItem.id) {
                            this.map.Mapsummaryitems[i].x = this.currentItem.x;
                            this.map.Mapsummaryitems[i].y = this.currentItem.y;

                            //We are done here
                            break;
                        }
                    }
                } else {
                    //New created item
                    if (typeof this.map.Mapsummaryitems === "undefined") {
                        this.map.Mapsummaryitems = [];
                    }

                    this.map.Mapsummaryitems.push(result.data.Mapsummaryitem.Mapsummaryitem);
                    //setTimeout(makeDraggable, 250);
                }

                //$('#addEditSummaryItemModal').modal('hide');
                this.notyService.genericSuccess(msg, title);
                return;
            }

            // Error
            const errorResponse = result.data as GenericValidationError;
            this.notyService.genericError();
            if (result) {
                this.errors = errorResponse;

            }
        }));
    };

    public deleteSummaryItem() {
        this.currentItem.map_id = this.mapId;

        this.currentDeletedItem = {
            id: this.currentItem.id,
            type: MapItemType.SUMMARYITEM
        }

        this.subscriptions.add(this.MapeditorsService.deleteSummaryItem({
            'Mapsummaryitem': this.currentItem,
            'action': 'delete'
        }).subscribe((result) => {
            this.cdr.markForCheck();
            if (result.success) {
                const title = this.TranslocoService.translate('Data');
                const msg = this.TranslocoService.translate('saved successfully');

                //Remove item from current scope
                for (let i in this.map.Mapsummaryitems) {
                    if (this.map.Mapsummaryitems[i].id == this.currentItem.id) {
                        this.map.Mapsummaryitems.splice(Number(i), 1);

                        //We are done here
                        break;
                    }
                }

                this.notyService.genericSuccess(msg, title);
                //$('#addEditSummaryItemModal').modal('hide');
                this.currentItem = {};
                delete this.currentDeletedItem;
                return;
            }

            // Error
            const errorResponse = result.data as GenericValidationError;
            this.notyService.genericError();
            if (result) {
                delete this.currentDeletedItem;
                this.errors = errorResponse;

            }
        }));
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

    public editText(item: any) {
        this.action = 'text';
        this.currentItem = item;
        this.addLink = false;
        //$('#docuText').val(item.text);
        //$('#AddEditStatelessTextModal').modal('show');
    };

    public saveText(action: string) {
        if (typeof action === 'undefined') {
            action = 'add_or_edit';
        }

        this.currentItem.map_id = this.mapId.toString();
        if (action === 'add_or_edit') {
            //this.currentItem.text = $('#docuText').val();
        }

        this.subscriptions.add(this.MapeditorsService.saveText({
            'Maptext': this.currentItem,
            'action': action
        }).subscribe((result) => {
            this.cdr.markForCheck();
            if (result.success) {
                const title = this.TranslocoService.translate('Data');
                const msg = this.TranslocoService.translate('saved successfully');

                //Update possition in current scope json data
                if (this.currentItem.hasOwnProperty('id')) {
                    for (let i in this.map.Maptexts) {
                        if (this.map.Maptexts[i].id == this.currentItem.id) {
                            this.map.Maptexts[i].x = this.currentItem.x;
                            this.map.Maptexts[i].y = this.currentItem.y;
                            if (action === 'add_or_edit') {
                                this.map.Maptexts[i].text = this.currentItem.text;
                            }

                            //We are done here
                            break;
                        }
                    }
                } else {
                    //New created item
                    if (typeof this.map.Maptexts === "undefined") {
                        this.map.Maptexts = [];
                    }

                    this.map.Maptexts.push(result.data.Maptext.Maptext);
                    //setTimeout(makeDraggable, 250);
                }

                //$('#AddEditStatelessTextModal').modal('hide');
                this.notyService.genericSuccess(msg, title);
                return;
            }

            // Error
            const errorResponse = result.data as GenericValidationError;
            this.notyService.genericError();
            if (result) {
                this.errors = errorResponse;

            }
        }));
    };

    public deleteText() {
        this.currentItem.map_id = this.mapId;

        this.currentDeletedItem = {
            id: this.currentItem.id,
            type: MapItemType.TEXT
        }

        this.subscriptions.add(this.MapeditorsService.deleteText({
            'Maptext': this.currentItem,
            'action': 'delete'
        }).subscribe((result) => {
            this.cdr.markForCheck();
            if (result.success) {
                const title = this.TranslocoService.translate('Data');
                const msg = this.TranslocoService.translate('saved successfully');

                for (let i in this.map.Maptexts) {
                    if (this.map.Maptexts[i].id == this.currentItem.id) {
                        this.map.Maptexts.splice(Number(i), 1);
                        //$('#docuText').val('');

                        //We are done here
                        break;
                    }
                }

                this.notyService.genericSuccess(msg, title);
                //$('#AddEditStatelessTextModal').modal('hide');
                this.currentItem = {};
                delete this.currentDeletedItem;
                return;
            }

            // Error
            const errorResponse = result.data as GenericValidationError;
            this.notyService.genericError();
            if (result) {
                delete this.currentDeletedItem;
                this.errors = errorResponse;

            }
        }));
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

    public editIcon(item: any) {
        this.action = 'icon';
        this.currentItem = item;
        //$('#AddEditStatelessIconModal').modal('show');
    };

    public saveIcon(action: string) {
        if (typeof action === 'undefined') {
            action = 'add_or_edit';
        }

        this.currentItem.map_id = this.mapId.toString();


        this.subscriptions.add(this.MapeditorsService.saveIcon({
            'Mapicon': this.currentItem,
            'action': action
        }).subscribe((result) => {
            this.cdr.markForCheck();
            if (result.success) {
                const title = this.TranslocoService.translate('Data');
                const msg = this.TranslocoService.translate('saved successfully');


                //Update possition in current scope json data
                if (this.currentItem.hasOwnProperty('id')) {
                    for (let i in this.map.Mapicons) {
                        if (this.map.Mapicons[i].id == this.currentItem.id) {
                            this.map.Mapicons[i].x = this.currentItem.x;
                            this.map.Mapicons[i].y = this.currentItem.y;

                            //We are done here
                            break;
                        }
                    }
                } else {
                    //New created item
                    if (typeof this.map.Mapicons === "undefined") {
                        this.map.Mapicons = [];
                    }

                    this.map.Mapicons.push(result.data.Mapicon.Mapicon);
                    //setTimeout(makeDraggable, 250);
                }

                //$('#AddEditStatelessIconModal').modal('hide');
                this.notyService.genericSuccess(msg, title);
                return;
            }

            // Error
            const errorResponse = result.data as GenericValidationError;
            this.notyService.genericError();
            if (result) {
                this.errors = errorResponse;

            }
        }));
    };

    public deleteIcon() {
        this.currentItem.map_id = this.mapId;

        this.currentDeletedItem = {
            id: this.currentItem.id,
            type: MapItemType.ICON
        }

        this.subscriptions.add(this.MapeditorsService.deleteIcon({
            'Mapicon': this.currentItem,
            'action': 'delete'
        }).subscribe((result) => {
            this.cdr.markForCheck();
            if (result.success) {
                const title = this.TranslocoService.translate('Data');
                const msg = this.TranslocoService.translate('saved successfully');

                //Remove item from current scope
                for (let i in this.map.Mapicons) {
                    if (this.map.Mapicons[i].id == this.currentItem.id) {
                        this.map.Mapicons.splice(Number(i), 1);

                        //We are done here
                        break;
                    }
                }

                this.notyService.genericSuccess(msg, title);
                //$('#AddEditStatelessIconModal').modal('hide');
                this.currentItem = {};
                delete this.currentDeletedItem;
                return;
            }

            // Error
            const errorResponse = result.data as GenericValidationError;
            this.notyService.genericError();
            if (result) {
                delete this.currentDeletedItem;
                this.errors = errorResponse;

            }
        }));
    };

    public saveMapeditorSettings() {

        this.subscriptions.add(this.MapeditorsService.saveMapeditorSettings({
            'Map': {
                id: this.mapId.toString(),
            },
            'Mapeditor': this.Mapeditor
        }).subscribe((result) => {
            this.cdr.markForCheck();
            if (result.success) {
                const title = this.TranslocoService.translate('Data');
                const msg = this.TranslocoService.translate('saved successfully');

                this.notyService.genericSuccess(msg, title);
                return;
            }

            // Error
            const errorResponse = result.data as GenericValidationError;
            this.notyService.genericError();
            if (result) {
                this.errors = errorResponse;

            }
        }));
    };

    protected readonly parseInt = parseInt;
}
