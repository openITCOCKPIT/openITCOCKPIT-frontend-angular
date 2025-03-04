import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { GenericValidationError } from '../../../../../generic-responses';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { MapeditorsService } from '../mapeditors.service';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HistoryService } from '../../../../../history.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import {
    AlertComponent,
    ButtonCloseDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ModalToggleDirective,
    NavComponent,
    NavItemComponent,
    RowComponent,
} from '@coreui/angular';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';
import { DOCUMENT, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapItemComponent } from '../../../components/map-item/map-item.component';
import { MapCanvasComponent } from '../../../components/map-canvas/map-canvas.component';
import _, { parseInt } from 'lodash';
import {
    Background,
    GadgetPreviews,
    Iconset,
    Mapeditor,
    MapRoot,
    MapsByStringParams,
    MaxUploadLimit,
    ServicesByStringParams,
    VisibleLayers
} from '../mapeditors.interface';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import {
    ContextAction,
    MapitemBaseActionObject,
    ResizedEvent
} from '../../../components/map-item-base/map-item-base.interface';
import { MapTextComponent } from '../../../components/map-text/map-text.component';
import { MapIconComponent } from '../../../components/map-icon/map-icon.component';
import { MapLineComponent } from '../../../components/map-line/map-line.component';
import { MapItemType } from '../../../components/map-item-base/map-item-base.enum';
import { MapSummaryItemComponent } from '../../../components/map-summary-item/map-summary-item.component';
import { PerfdataTextItemComponent } from '../../../components/perfdata-text-item/perfdata-text-item.component';
import { TrafficlightItemComponent } from '../../../components/trafficlight-item/trafficlight-item.component';
import { CylinderItemComponent } from '../../../components/cylinder-item/cylinder-item.component';
import { TachoItemComponent } from '../../../components/tacho-item/tacho-item.component';
import { TemperatureItemComponent } from '../../../components/temperature-item/temperature-item.component';
import { GraphItemComponent } from '../../../components/graph-item/graph-item.component';
import { ServiceOutputItemComponent } from '../../../components/service-output-item/service-output-item.component';
import { BackgrounduploadsService } from '../Backgrounduploads.service';
import { HostsService } from '../../../../../pages/hosts/hosts.service';
import { HostsLoadHostsByStringParams } from '../../../../../pages/hosts/hosts.interface';
import { HostgroupsService } from '../../../../../pages/hostgroups/hostgroups.service';
import { HostgroupsLoadHostgroupsByStringParams } from '../../../../../pages/hostgroups/hostgroups.interface';
import {
    ServicegroupsLoadServicegroupsByStringParams
} from '../../../../../pages/servicegroups/servicegroups.interface';
import { ServicegroupsService } from '../../../../../pages/servicegroups/servicegroups.service';
import { SelectKeyValue, SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import Dropzone from 'dropzone';
import { AuthService } from '../../../../../auth/auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BbCodeEditorComponent } from '../../../../../pages/documentations/bb-code-editor/bb-code-editor.component';

@Component({
    selector: 'oitc-mapeditors-edit',
    imports: [
        FaIconComponent,
        PermissionDirective,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        BackButtonDirective,
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
        MapSummaryItemComponent,
        PerfdataTextItemComponent,
        TrafficlightItemComponent,
        CylinderItemComponent,
        TachoItemComponent,
        TemperatureItemComponent,
        GraphItemComponent,
        ServiceOutputItemComponent,
        ButtonCloseDirective,
        FormControlDirective,
        FormDirective,
        FormLabelDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        TranslocoPipe,
        RowComponent,
        ColComponent,
        FormErrorDirective,
        SelectComponent,
        ModalToggleDirective,
        FormFeedbackComponent,
        RequiredIconComponent,
        XsButtonDirective,
        AlertComponent,
        BbCodeEditorComponent
    ],
    templateUrl: './mapeditors-edit.component.html',
    styleUrl: './mapeditors-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapeditorsEditComponent implements OnInit, OnDestroy {

    @ViewChild(FCanvasComponent, {static: true})
    public fCanvasComponent!: FCanvasComponent;
    @ViewChild('mapEditor') mapEditor!: ElementRef<HTMLDivElement>;

    private subscriptions: Subscription = new Subscription();
    private MapeditorsService: MapeditorsService = inject(MapeditorsService);
    private BackgrounduploadsService: BackgrounduploadsService = inject(BackgrounduploadsService);
    private HostsService: HostsService = inject(HostsService);
    private HostgroupsService: HostgroupsService = inject(HostgroupsService);
    private ServicegroupsService: ServicegroupsService = inject(ServicegroupsService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly modalService = inject(ModalService);
    private readonly authService = inject(AuthService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private route = inject(ActivatedRoute);
    public errors: GenericValidationError | null = null;
    private cdr = inject(ChangeDetectorRef);
    private readonly document = inject(DOCUMENT);

    public init = true;
    protected mapId: number = 0;
    public map!: MapRoot;
    protected helplineSizes: number[] = [5, 10, 15, 20, 25, 30, 50, 80];
    protected gridSizes = [5, 10, 15, 20, 25, 30, 50, 80];
    public gridSize: { x: number, y: number } = {x: 25, y: 25};

    public backgrounds: Background[] = [];
    public lastBackgroundImageToDeletePreventForSave: string | null = null;

    public layers: {
        key: string
        value: string
    }[] = [];
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

    public maxUploadLimit?: MaxUploadLimit;
    public iconsets: Iconset[] = [];
    public icons: string[] = [];
    public metrics: SelectKeyValueString[] = [];
    public itemObjects: SelectKeyValue[] = [];
    public mapItemObjectTypes: SelectKeyValueString[] = [];
    public mapLineObjectTypes: SelectKeyValueString[] = [];
    public mapGadgetsOutputTypes = [
        {key: 'service_output', value: this.TranslocoService.translate('Service output')},
        {key: 'service_long_output', value: this.TranslocoService.translate('Service long output')}
    ];
    public requiredIcons: string[] = [];
    public gadgetPreviews: GadgetPreviews[] = [];

    constructor(private sanitizer: DomSanitizer) {
        this.deleteItem = this.deleteItem.bind(this);
        this.deleteIcon = this.deleteIcon.bind(this);
        this.deleteLine = this.deleteLine.bind(this);
        this.deleteText = this.deleteText.bind(this);
        this.deleteSummaryItem = this.deleteSummaryItem.bind(this);
        this.deleteGadget = this.deleteGadget.bind(this);
        this.saveItem = this.saveItem.bind(this);
        this.saveIcon = this.saveIcon.bind(this);
        this.saveLine = this.saveLine.bind(this);
        this.saveText = this.saveText.bind(this);
        this.saveSummaryItem = this.saveSummaryItem.bind(this);
        this.saveGadget = this.saveGadget.bind(this);
    }

    public ngOnInit(): void {
        this.mapId = Number(this.route.snapshot.paramMap.get('id'));
        this.initSelectOptions();
        this.load();
        this.loadIconsets();
        this.loadIcons();
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
                this.requiredIcons = result.requiredIcons;
                this.gadgetPreviews = result.gadgetPreviews;
                this.layers = [];
                for (let layer in result.layers) {
                    this.layers.push({
                        key: layer,
                        value: result.layers[Number(layer)]
                    });
                }

                for (let k in this.layers) {
                    this.visibleLayers['layer_' + this.layers[k].key] = true;
                }

                if (this.map.Map.background) {
                    this.currentBackground = this.map.Map.background;
                }

                if (this.init) {
                    this.createDropzones();
                    this.loadBackgroundImages();
                }

                this.init = false;
                this.changeGridSize(this.Mapeditor.grid.size);
                this.cdr.markForCheck();
            }));
    }

    private initSelectOptions(): void {
        let selectItemObjectTypes: { value: string, key: string }[] = [];
        this.subscriptions.add(this.PermissionsService.hasPermissionObservable(['hosts', 'index']).subscribe(hasPermission => {
            if (hasPermission) {
                selectItemObjectTypes.push({
                    key: 'host',
                    value: this.TranslocoService.translate('Host')
                });
            }
        }));
        this.subscriptions.add(this.PermissionsService.hasPermissionObservable(['services', 'index']).subscribe(hasPermission => {
            if (hasPermission) {
                selectItemObjectTypes.push({
                    key: 'service',
                    value: this.TranslocoService.translate('Service')
                });
            }
        }));
        this.subscriptions.add(this.PermissionsService.hasPermissionObservable(['hostgroups', 'index']).subscribe(hasPermission => {
            if (hasPermission) {
                selectItemObjectTypes.push({
                    key: 'hostgroup',
                    value: this.TranslocoService.translate('Hostgroup')
                });
            }
        }));
        this.subscriptions.add(this.PermissionsService.hasPermissionObservable(['servicegroups', 'index']).subscribe(hasPermission => {
            if (hasPermission) {
                selectItemObjectTypes.push({
                    key: 'servicegroup',
                    value: this.TranslocoService.translate('Servicegroup')
                });
            }
        }));
        selectItemObjectTypes.push({
            key: 'map',
            value: this.TranslocoService.translate('Map')
        });
        this.mapItemObjectTypes = selectItemObjectTypes;
        this.mapLineObjectTypes = structuredClone(selectItemObjectTypes);
        this.mapLineObjectTypes.push({
            key: 'stateless',
            value: this.TranslocoService.translate('Stateless line')
        });
        this.cdr.markForCheck();

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
                this.saveGadget('dragstop');
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

        this.gridSize = {x: size, y: size};
        this.onMapeditorChange();
        this.cdr.markForCheck();

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
        if (this.init) {
            return;
        }
        this.Mapeditor.helplines = {...this.Mapeditor.helplines};
        this.onMapeditorChange();
        this.cdr.markForCheck();
    }

    public onItemsChange(objectName: keyof MapRoot) {
        this.map[objectName] = [...this.map[objectName]];
        this.cdr.markForCheck();
    }

    public onItemChange(objectName: keyof MapRoot, index: number) {
        this.map[objectName][index] = {...this.map[objectName][index]};
        this.cdr.markForCheck();
    }

    public onSynchronizeGridAndHelplinesSize(isEnabled: boolean) {
        this.Mapeditor.synchronizeGridAndHelplinesSize = isEnabled;
        this.onMapeditorChange();
        this.cdr.markForCheck();

        if (this.init) {
            return;
        }

        if (this.Mapeditor.synchronizeGridAndHelplinesSize && (this.Mapeditor.helplines.size != this.Mapeditor.grid.size)) {
            this.changeGridSize(this.Mapeditor.helplines.size);
        }
    }

    public onGridEnabledChange() {
        if (this.init) {
            return;
        }
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
        this.defaultLayer = layerNo.toString();
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
                        this.onItemsChange(objectName);
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
                        this.onItemsChange(objectName);
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
            switch ($event.itemType) {
                case MapItemType.ITEM:
                    this.editItem($event.item);
                    break;
                case MapItemType.TEXT:
                    this.editText($event.item);
                    break;
                case MapItemType.ICON:
                    this.editIcon($event.item);
                    break;
                case MapItemType.LINE:
                    this.editLine($event.item);
                    break;
                case MapItemType.SUMMARYITEM:
                    this.editSummaryItem($event.item);
                    break;
                case MapItemType.GADGET:
                    this.editGadget($event.item);
                    break;
                default:
                    console.log('Unknown map object type');
                    this.notyService.genericError();
            }
        }
        if (type === 'layer') {
            this.changeLayerFromContextMenu($event, MapItemType.ITEM, 'Mapitems', this.saveItem);
            this.changeLayerFromContextMenu($event, MapItemType.TEXT, 'Maptexts', this.saveText);
            this.changeLayerFromContextMenu($event, MapItemType.ICON, 'Mapicons', this.saveIcon);
            this.changeLayerFromContextMenu($event, MapItemType.LINE, 'Maplines', this.saveLine);
            this.changeLayerFromContextMenu($event, MapItemType.SUMMARYITEM, 'Mapsummaryitems', this.saveSummaryItem);
            this.changeLayerFromContextMenu($event, MapItemType.GADGET, 'Mapgadgets', this.saveGadget);
        }
        if (type === 'delete') {
            this.deleteFromContextMenu($event, MapItemType.ITEM, 'Mapitems', this.deleteItem);
            this.deleteFromContextMenu($event, MapItemType.TEXT, 'Maptexts', this.deleteText);
            this.deleteFromContextMenu($event, MapItemType.ICON, 'Mapicons', this.deleteIcon);
            this.deleteFromContextMenu($event, MapItemType.LINE, 'Maplines', this.deleteLine);
            this.deleteFromContextMenu($event, MapItemType.SUMMARYITEM, 'Mapsummaryitems', this.deleteSummaryItem);
            this.deleteFromContextMenu($event, MapItemType.GADGET, 'Mapgadgets', this.deleteGadget);
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
                    this.cdr.markForCheck();
                    break;
                }
            }
        }
    }

    public onResizeStop(event: ResizedEvent) {
        const id = event.id;
        const type = event.itemType;
        const newWidth = event.width;
        const newHeight = event.height;

        switch (type) {
            case MapItemType.GADGET:
                // create new reference to object to trigger change detection
                this.map.Mapgadgets = this.map.Mapgadgets.map(gadget => {
                    if (gadget.id === id) {
                        return {
                            ...gadget,
                            size_y: newHeight,
                            size_x: newWidth
                        };
                    }
                    return gadget;
                });
                this.currentItem = {id, size_x: newWidth, size_y: newHeight};
                this.saveGadget('resizestop');
                this.cdr.markForCheck();
                break;

            case MapItemType.SUMMARYITEM:
                // create new reference to object to trigger change detection
                this.map.Mapsummaryitems = this.map.Mapsummaryitems.map(summaryItem => {
                    if (summaryItem.id === id) {
                        return {
                            ...summaryItem,
                            size_y: newHeight,
                            size_x: newWidth
                        };
                    }
                    return summaryItem;
                });
                this.currentItem = {id, size_x: newWidth, size_y: newHeight};
                this.saveSummaryItem('resizestop');
                this.cdr.markForCheck();
                break;

            default:
                console.log('Unknown map object type');
                this.notyService.genericError();
        }
    }

    public openChangeMapBackgroundModal() {
        if (this.map && this.map.Map && this.map.Map.background && this.map.Map.background.length > 0) {
            if (this.backgrounds.length === 0) {
                this.brokenImageDetected = true;
            } else {
                this.brokenImageDetected = _.filter(
                    this.backgrounds, (background) => background.image === this.map.Map.background).length === 0;
            }
        }

        this.modalService.toggle({
            show: true,
            id: 'changeBackgroundModal',
        });
    };

    private loadBackgroundImages(selectedImage?: string) {

        this.subscriptions.add(this.MapeditorsService.getBackgroundImages()
            .subscribe((result) => {
                this.backgrounds = result.backgrounds;

                if (typeof selectedImage !== "undefined") {
                    this.changeBackground({
                        image: selectedImage
                    });
                }
                this.cdr.markForCheck();
            }));
    };

    public changeBackground(background: Background) {
        if (background !== undefined && this.lastBackgroundImageToDeletePreventForSave === background.image) {
            this.lastBackgroundImageToDeletePreventForSave = null;
            this.map.Map.background = null;
            return;
        }

        this.subscriptions.add(this.MapeditorsService.saveBackground({
            'Map': {
                id: this.mapId.toString(),
                background: background.image
            }
        }).subscribe((result) => {
            this.cdr.markForCheck();
            if (result.success) {
                const title = this.TranslocoService.translate('Data');
                const msg = this.TranslocoService.translate('saved successfully');

                this.map.Map.background = background.image;
                this.map.Map = {...this.map.Map};

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

    public deleteBackground(background: Background) {
        this.lastBackgroundImageToDeletePreventForSave = background.image;
        this.subscriptions.add(this.BackgrounduploadsService.deleteBackground(background.image).subscribe((result) => {
            this.cdr.markForCheck();
            if (result.success) {
                const msg = this.TranslocoService.translate(result.data.response.message);

                this.loadBackgroundImages();

                this.notyService.genericSuccess(msg);
                return;
            }

            // Error
            const errorResponse = result.data as GenericValidationError;
            let text = '';
            if (errorResponse.hasOwnProperty('message')) {
                text = result.data.message;
            }

            if (errorResponse.hasOwnProperty('response')) {
                text = result.data.response.message;
            }

            this.notyService.genericError(text);
            if (result) {
                this.errors = errorResponse;

            }
        }));
    };

    public resetBackground() {

        this.subscriptions.add(this.MapeditorsService.resetBackground(this.mapId).subscribe((result) => {
            this.cdr.markForCheck();
            if (result.success) {
                const title = this.TranslocoService.translate('Data');
                const msg = this.TranslocoService.translate('saved successfully');

                this.map.Map.background = null;
                this.brokenImageDetected = false;

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

    public setCurrentIconset(iconset: string) {
        this.currentItem.iconset = iconset;
    };

    public addNewLayer() {
        this.maxZIndex++;

        let newZIndex = this.maxZIndex;

        this.layers.push({key: newZIndex.toString(), value: 'Layer ' + newZIndex.toString()});
        this.layers = [...this.layers];
        this.visibleLayers['layer_' + newZIndex] = true;

        if (this.currentItem.hasOwnProperty('z_index')) {
            this.currentItem.z_index = newZIndex.toString();
        }
    };

    //Gets called by on-click on the map editor contain
    public addNewObjectFunc(event: MouseEvent) {
        if (!this.addNewObject) {
            return;
        }

        let mapEditor = this.mapEditor.nativeElement;

        switch (this.action) {
            case MapItemType.ITEM:
                mapEditor.style.cursor = 'default';
                this.addNewObject = false;

                this.modalService.toggle({
                    show: true,
                    id: 'addEditMapItemModal',
                });

                // Create currentItem skeleton
                // Set X and Y poss of the new object
                this.currentItem = {
                    iconset: 'std_mid_64px',
                    z_index: this.defaultLayer, //Yes we need this as a string!
                    x: event.offsetX,
                    y: event.offsetY,
                    show_label: false,
                    label_possition: 2
                    //x: $event.pageX,
                    //y: $event.pageY
                };

                this.action = null;
                this.cdr.markForCheck();
                break;

            case MapItemType.LINE:
                if (this.clickCount === 2) {
                    //Endpoint of the line
                    mapEditor.style.cursor = 'default';
                    this.addNewObject = false;
                    this.action = null;


                    this.currentItem['endX'] = event.offsetX;
                    this.currentItem['endY'] = event.offsetY;

                    this.modalService.toggle({
                        show: true,
                        id: 'addEditMapLineModal',
                    });
                }

                if (this.clickCount === 1) {

                    this.currentItem = {
                        z_index: this.defaultLayer, //Yes we need this as a string!
                        startX: event.offsetX,
                        startY: event.offsetY,
                        show_label: false
                    };

                    const options = {
                        timeOut: 3500,
                        progressBar: true,
                        enableHtml: true,
                        positionClass: 'toast-top-center'
                    }
                    this.notyService.noty('Click a second time to define the endpoint of the line.', 'info', options, '');
                }

                this.clickCount++;
                this.cdr.markForCheck();
                break;

            case MapItemType.GADGET:
                mapEditor.style.cursor = 'default';
                this.addNewObject = false;

                this.modalService.toggle({
                    show: true,
                    id: 'addEditMapGadgetModal',
                });

                // Create currentItem skeleton
                // Set X and Y poss of the new object
                this.currentItem = {
                    type: 'service', //Gadgets are only available for services
                    z_index: this.defaultLayer, //Yes we need this as a string!
                    x: event.offsetX,
                    y: event.offsetY,
                    show_label: false,
                    label_possition: 2,
                    gadget: 'RRDGraph',
                    size_x: null,
                    size_y: null,
                    metric: null,
                    output_type: null,
                    font_size: 13
                };

                this.action = null;
                this.onCurrentItemTypeObjectIdChange();
                this.cdr.markForCheck();
                break;

            case MapItemType.TEXT:
                mapEditor.style.cursor = 'default';
                this.addNewObject = false;

                this.modalService.toggle({
                    show: true,
                    id: 'AddEditStatelessTextModal',
                });

                // Create currentItem skeleton
                // Set X and Y poss of the new object
                this.currentItem = {
                    z_index: this.defaultLayer, //Yes we need this as a string!
                    x: event.offsetX,
                    y: event.offsetY,
                    text: ''
                };

                this.action = null;
                this.cdr.markForCheck();
                break;

            case MapItemType.ICON:
                mapEditor.style.cursor = 'default';
                this.addNewObject = false;

                this.modalService.toggle({
                    show: true,
                    id: 'AddEditStatelessIconModal',
                });

                // Create currentItem skeleton
                // Set X and Y poss of the new object
                this.currentItem = {
                    z_index: this.defaultLayer, //Yes we need this as a string!
                    x: event.offsetX,
                    y: event.offsetY

                };

                this.action = null;
                this.cdr.markForCheck();
                break;

            case MapItemType.SUMMARYITEM:
                mapEditor.style.cursor = 'default';
                this.addNewObject = false;

                this.modalService.toggle({
                    show: true,
                    id: 'addEditSummaryItemModal',
                });

                // Create currentItem skeleton
                // Set X and Y poss of the new object
                this.currentItem = {
                    z_index: this.defaultLayer, //Yes we need this as a string!
                    x: event.offsetX,
                    y: event.offsetY,
                    show_label: false,
                    label_possition: 2
                };

                this.action = null;
                this.cdr.markForCheck();
                break;

            default:
                this.notyService.genericWarning('Unknown action - sorry :(');
                this.action = null;
                this.addNewObject = false;
                mapEditor.style.cursor = 'default';
                this.cdr.markForCheck();
                break;
        }
    };

    private loadIconsets(selectedIconset?: string) {
        this.subscriptions.add(this.MapeditorsService.getIconsets()
            .subscribe((result) => {
                this.iconsets = [];
                this.iconsets = result.iconsets;

                if (typeof selectedIconset !== "undefined") {
                    this.currentItem.iconset = selectedIconset;
                }
                this.cdr.markForCheck();
            }));
    };

    private loadIcons(selectedIcon?: string) {
        this.subscriptions.add(this.MapeditorsService.getIcons()
            .subscribe((result) => {
                this.icons = result.icons;

                if (typeof selectedIcon !== "undefined") {
                    this.currentItem.icon = selectedIcon;
                }
                this.cdr.markForCheck();
            }));
    };

    private loadMetrics() {
        this.subscriptions.add(this.MapeditorsService.getPerformanceDataMetrics(this.currentItem.object_id)
            .subscribe((result) => {
                let metrics: { key: string, value: string }[] = [];
                this.currentItem.metric = null;

                let firstMetric = null;

                for (let metricKey in result.perfdata) {
                    if (firstMetric === null) {
                        firstMetric = metricKey;
                    }
                    let metricDisplayName = result.perfdata[metricKey].metric

                    metrics.push({
                        key: metricKey,
                        value: metricDisplayName
                    });
                }

                if (this.currentItem.metric === null) {
                    this.currentItem.metric = firstMetric;
                }

                this.metrics = metrics;
                this.cdr.markForCheck();
            }));
    };

    public deleteIconImage(filename: string) {

        this.subscriptions.add(this.BackgrounduploadsService.deleteIconImage(filename).subscribe((result) => {
            this.cdr.markForCheck();
            if (result.success) {
                const msg = this.TranslocoService.translate(result.data.response.message);

                this.loadIcons();

                this.notyService.genericSuccess(msg);
                return;
            }

            // Error
            const errorResponse = result.data as GenericValidationError;
            let text = '';
            if (result.data.hasOwnProperty('message')) {
                text = result.data.message;
            }

            if (result.data.hasOwnProperty('response')) {
                text = result.data.response.message;
            }

            this.notyService.genericError(text);
            if (result) {
                this.errors = errorResponse;

            }
        }));
    };

    public addItem() {

        const options = {
            timeOut: 3500,
            progressBar: true,
            enableHtml: true,
            positionClass: 'toast-top-center'
        }
        this.notyService.noty('Click at the position on the map, where you want to create a new object.', 'info', options, '');
        this.mapEditor.nativeElement.style.cursor = 'crosshair';
        this.addNewObject = true;
        this.action = 'item';
        this.cdr.markForCheck();
    };

    public editItem(item: any) {
        this.action = 'item';
        this.currentItem = item;
        this.onCurrentItemTypeObjectIdChange();
        this.modalService.toggle({
            show: true,
            id: 'addEditMapItemModal',
        });
        this.cdr.markForCheck();
    };

    public saveItem(action?: string) {
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
                    let itemIndex: number | undefined;
                    for (let i in this.map.Mapitems) {
                        if (this.map.Mapitems[i].id == this.currentItem.id) {
                            itemIndex = Number(i);
                            this.map.Mapitems[i].x = this.currentItem.x;
                            this.map.Mapitems[i].y = this.currentItem.y;
                            //We are done here
                            break;
                        }
                    }
                    if (itemIndex !== undefined) {
                        this.onItemChange('Mapitems', itemIndex);
                    }
                } else {
                    //New created item
                    if (typeof this.map.Mapitems === "undefined") {
                        this.map.Mapitems = [];
                    }
                    this.map.Mapitems.push(result.data.Mapitem.Mapitem);
                }

                this.modalService.toggle({
                    show: false,
                    id: 'addEditMapItemModal',
                });
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
                this.modalService.toggle({
                    show: false,
                    id: 'addEditMapItemModal',
                });
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
        this.mapEditor.nativeElement.style.cursor = 'crosshair';
        this.addNewObject = true;
        this.action = 'line';
        this.cdr.markForCheck();
    };

    public editLine(lineItem: any) {
        this.action = 'line';
        this.currentItem = lineItem;
        this.onCurrentItemTypeObjectIdChange();
        this.modalService.toggle({
            show: true,
            id: 'addEditMapLineModal',
        });
        this.cdr.markForCheck();
    };

    public saveLine(action?: string) {
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
                    let itemIndex: number | undefined;
                    for (let i in this.map.Maplines) {
                        if (this.map.Maplines[i].id == this.currentItem.id) {
                            itemIndex = Number(i);
                            this.map.Maplines[i].startY = this.currentItem.startY;
                            this.map.Maplines[i].endX = this.currentItem.endX;
                            this.map.Maplines[i].endY = this.currentItem.endY;
                            this.map.Maplines[i].startX = this.currentItem.startX; //Change this last because of $watch in directive

                            //We are done here
                            break;
                        }
                    }
                    if (itemIndex !== undefined) {
                        this.onItemChange('Maplines', itemIndex);
                    }
                } else {
                    //New created item
                    if (typeof this.map.Maplines === "undefined") {
                        this.map.Maplines = [];
                    }

                    this.map.Maplines.push(result.data.Mapline.Mapline);
                }

                this.modalService.toggle({
                    show: false,
                    id: 'addEditMapLineModal',
                });
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
                this.modalService.toggle({
                    show: false,
                    id: 'addEditMapLineModal',
                });
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
        this.mapEditor.nativeElement.style.cursor = 'crosshair';
        this.addNewObject = true;
        this.action = 'summaryItem';
        this.cdr.markForCheck();
    };

    public editSummaryItem(item: any) {
        this.action = 'summaryItem';
        this.currentItem = item;
        this.onCurrentItemTypeObjectIdChange();
        this.modalService.toggle({
            show: true,
            id: 'addEditSummaryItemModal',
        });
        this.cdr.markForCheck();
    };

    public saveSummaryItem(action?: string) {
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
                    let itemIndex: number | undefined;
                    for (let i in this.map.Mapsummaryitems) {
                        if (this.map.Mapsummaryitems[i].id == this.currentItem.id) {
                            itemIndex = Number(i);
                            this.map.Mapsummaryitems[i].x = this.currentItem.x;
                            this.map.Mapsummaryitems[i].y = this.currentItem.y;

                            //We are done here
                            break;
                        }
                    }
                    if (itemIndex !== undefined) {
                        this.onItemChange('Mapsummaryitems', itemIndex);
                    }
                } else {
                    //New created item
                    if (typeof this.map.Mapsummaryitems === "undefined") {
                        this.map.Mapsummaryitems = [];
                    }

                    this.map.Mapsummaryitems.push(result.data.Mapsummaryitem.Mapsummaryitem);
                }

                this.modalService.toggle({
                    show: false,
                    id: 'addEditSummaryItemModal',
                });
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
                this.modalService.toggle({
                    show: false,
                    id: 'addEditSummaryItemModal',
                });
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
        this.mapEditor.nativeElement.style.cursor = 'crosshair';
        this.addNewObject = true;
        this.action = 'gadget';
        this.cdr.markForCheck();
    };

    public editGadget(gadgetItem: any) {
        this.action = 'gadget';
        this.currentItem = JSON.parse(JSON.stringify(gadgetItem));    //real clone
        this.onCurrentItemTypeObjectIdChange();
        this.modalService.toggle({
            show: true,
            id: 'addEditMapGadgetModal',
        });
        this.cdr.markForCheck();
    };

    public saveGadget(action?: string) {
        if (typeof action === 'undefined') {
            action = 'add_or_edit';
        }

        this.currentItem.map_id = this.mapId.toString();

        this.subscriptions.add(this.MapeditorsService.saveGadget({
            'Mapgadget': this.currentItem,
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
                    let itemIndex: number | undefined;
                    for (let i in this.map.Mapgadgets) {
                        if (this.map.Mapgadgets[i].id == this.currentItem.id) {
                            itemIndex = Number(i);
                            if (this.currentItem.object_id) {   // after edit
                                this.map.Mapgadgets[i] = this.currentItem;
                            } else {                            // only after (draggable) position change
                                this.map.Mapgadgets[i].x = this.currentItem.x;
                                this.map.Mapgadgets[i].y = this.currentItem.y;
                            }

                            //We are done here
                            break;
                        }
                    }
                    if (itemIndex !== undefined) {
                        this.onItemChange('Mapgadgets', itemIndex);
                    }
                } else {
                    //New created item
                    if (typeof this.map.Mapgadgets === "undefined") {
                        this.map.Mapgadgets = [];
                    }
                    this.map.Mapgadgets.push(result.data.Mapgadget.Mapgadget);
                }

                this.modalService.toggle({
                    show: false,
                    id: 'addEditMapGadgetModal',
                });
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

    public deleteGadget() {
        this.currentItem.map_id = this.mapId;

        this.currentDeletedItem = {
            id: this.currentItem.id,
            type: MapItemType.GADGET
        }

        this.subscriptions.add(this.MapeditorsService.deleteGadget({
            'Mapgadget': this.currentItem,
            'action': 'delete'
        }).subscribe((result) => {
            this.cdr.markForCheck();
            if (result.success) {
                const title = this.TranslocoService.translate('Data');
                const msg = this.TranslocoService.translate('saved successfully');

                //Remove item from current scope
                for (let i in this.map.Mapgadgets) {
                    if (this.map.Mapgadgets[i].id == this.currentItem.id) {
                        this.map.Mapgadgets.splice(Number(i), 1);

                        //We are done here
                        break;
                    }
                }

                this.notyService.genericSuccess(msg, title);
                this.modalService.toggle({
                    show: false,
                    id: 'addEditMapGadgetModal',
                });
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

    public addText() {
        const options = {
            timeOut: 3500,
            progressBar: true,
            enableHtml: true,
            positionClass: 'toast-top-center'
        }
        this.notyService.noty('Click at the position on the map, where you want to create new text', 'info', options, '');
        this.mapEditor.nativeElement.style.cursor = 'crosshair';
        this.addNewObject = true;
        this.action = 'text';
        this.addLink = false;
        this.cdr.markForCheck();
    };

    public editText(item: any) {
        this.action = 'text';
        this.currentItem = item;
        this.addLink = false;
        this.modalService.toggle({
            show: true,
            id: 'AddEditStatelessTextModal',
        });
        this.cdr.markForCheck();
    };

    public saveText(action?: string) {
        if (typeof action === 'undefined') {
            action = 'add_or_edit';
        }

        this.currentItem.map_id = this.mapId.toString();

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
                    let itemIndex: number | undefined;
                    for (let i in this.map.Maptexts) {
                        if (this.map.Maptexts[i].id == this.currentItem.id) {
                            itemIndex = Number(i);
                            this.map.Maptexts[i].x = this.currentItem.x;
                            this.map.Maptexts[i].y = this.currentItem.y;
                            if (action === 'add_or_edit') {
                                this.map.Maptexts[i].text = this.currentItem.text;
                            }

                            //We are done here
                            break;
                        }
                    }
                    if (itemIndex !== undefined) {
                        this.onItemChange('Maptexts', itemIndex);
                    }
                } else {
                    //New created item
                    if (typeof this.map.Maptexts === "undefined") {
                        this.map.Maptexts = [];
                    }

                    this.map.Maptexts.push(result.data.Maptext.Maptext);
                }

                this.modalService.toggle({
                    show: false,
                    id: 'AddEditStatelessTextModal',
                });
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

                        //We are done here
                        break;
                    }
                }

                this.notyService.genericSuccess(msg, title);
                this.modalService.toggle({
                    show: false,
                    id: 'AddEditStatelessTextModal',
                });
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
        this.mapEditor.nativeElement.style.cursor = 'crosshair';
        this.addNewObject = true;
        this.action = 'icon';
        this.cdr.markForCheck();
    };

    public editIcon(item: any) {
        this.action = 'icon';
        this.currentItem = item;
        this.modalService.toggle({
            show: true,
            id: 'AddEditStatelessIconModal',
        });
        this.cdr.markForCheck();
    };

    public saveIcon(action?: string) {
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
                    let itemIndex: number | undefined;
                    for (let i in this.map.Mapicons) {
                        if (this.map.Mapicons[i].id == this.currentItem.id) {
                            itemIndex = Number(i);
                            this.map.Mapicons[i].x = this.currentItem.x;
                            this.map.Mapicons[i].y = this.currentItem.y;

                            //We are done here
                            break;
                        }
                    }
                    if (itemIndex !== undefined) {
                        this.onItemChange('Mapicons', itemIndex);
                    }
                } else {
                    //New created item
                    if (typeof this.map.Mapicons === "undefined") {
                        this.map.Mapicons = [];
                    }

                    this.map.Mapicons.push(result.data.Mapicon.Mapicon);
                }

                this.modalService.toggle({
                    show: false,
                    id: 'AddEditStatelessIconModal',
                });
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
                this.modalService.toggle({
                    show: false,
                    id: 'AddEditStatelessIconModal',
                });
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

    /**
     * Load more objects if the user type to search in a select box.
     * @param searchString
     */
    public loadMoreItemObjects = (searchString: string) => {
        if (typeof this.currentItem.type !== "undefined") {

            //Avoid duplicate search requests because of $scope.currentItem.object_id will be set to
            //null if the search result will not contain the current selected object_id. If object_id is null
            //the watchGroup will be triggerd. This will cause duplicate search requests and overwrite results
            let objectId = undefined;
            if (typeof this.currentItem.object_id !== 'undefined') {
                if (this.currentItem.object_id !== null && this.currentItem.object_id > 0) {
                    objectId = this.currentItem.object_id;
                }
            }

            if (this.currentItem.type === 'host') {
                this.loadHosts(searchString, objectId);
            }

            if (this.currentItem.type === 'service') {
                this.loadServices(searchString, objectId);
            }

            if (this.currentItem.type === 'hostgroup') {
                this.loadHostgroups(searchString, objectId);
            }

            if (this.currentItem.type === 'servicegroup') {
                this.loadServicegroups(searchString, objectId);
            }

            if (this.currentItem.type === 'map') {
                this.loadMaps(searchString, objectId);
            }
        }
    };

    private loadHosts(searchString: string, selected: number[]) {
        if (typeof selected === "undefined") {
            selected = [];
        }

        const params: HostsLoadHostsByStringParams = {
            angular: true,
            'filter[Hosts.name]': searchString,
            'selected[]': selected,
            includeDisabled: true
        }


        this.subscriptions.add(this.HostsService.loadHostsByString(params)
            .subscribe((result) => {

                this.itemObjects = result;

                this.cdr.markForCheck();
            }));
    };

    private loadServices(searchString: string, selected: number[]) {
        if (typeof selected === "undefined") {
            selected = [];
        }

        const params: ServicesByStringParams = {
            'angular': true,
            //'filter[Hosts.name]': searchString,
            'filter[servicename]': searchString,
            'selected[]': selected,
            'includeDisabled': true
        }


        this.subscriptions.add(this.MapeditorsService.loadServicesByString(params)
            .subscribe((result) => {

                let tmpServices = [];
                for (let i in result.services) {
                    let tmpService = result.services[i];

                    let serviceName = tmpService.value.Service.name;
                    if (serviceName === null || serviceName === '') {
                        serviceName = tmpService.value.Servicetemplate.name;
                    }

                    tmpServices.push({
                        key: tmpService.key,
                        value: tmpService.value.Host.name + '/' + serviceName
                    });

                }

                this.itemObjects = tmpServices;

                this.cdr.markForCheck();
            }));
    };

    private loadHostgroups(searchString: string, selected: number[]) {
        if (typeof selected === "undefined") {
            selected = [];
        }

        const params: HostgroupsLoadHostgroupsByStringParams = {
            'angular': true,
            'filter[Containers.name]': searchString,
            'selected[]': selected
        }

        this.subscriptions.add(this.HostgroupsService.loadHostgroupsByString(params)
            .subscribe((result) => {

                this.itemObjects = result;

                this.cdr.markForCheck();
            }));
    };

    private loadServicegroups(searchString: string, selected: number[]) {
        if (typeof selected === "undefined") {
            selected = [];
        }

        const params: ServicegroupsLoadServicegroupsByStringParams = {
            'angular': true,
            'filter[Containers.name]': searchString,
            'selected[]': selected
        }

        this.subscriptions.add(this.ServicegroupsService.loadServicegroupsByString(params)
            .subscribe((result) => {

                this.itemObjects = result;

                this.cdr.markForCheck();
            }));
    };

    private loadMaps(searchString: string, selected: number[]) {
        if (typeof selected === "undefined") {
            selected = [];
        }

        const params: MapsByStringParams = {
            'angular': true,
            'filter[Maps.name]': searchString,
            'selected[]': selected,
            'excluded[]': [this.mapId]
        }

        this.subscriptions.add(this.MapeditorsService.loadMapsByString(params)
            .subscribe((result) => {

                this.itemObjects = result.maps;

                this.cdr.markForCheck();
            }));
    };

    private createDropzones() {
        let backgroundDropzone = this.document.getElementById('backgroundDropzone');
        if (backgroundDropzone) {
            const dropzone = new Dropzone(backgroundDropzone, {
                method: "post",
                maxFilesize: this.maxUploadLimit?.value, //MB
                acceptedFiles: 'image/gif,image/jpeg,image/png', //mimetypes
                paramName: "file",
                clickable: true,
                headers: {
                    'X-CSRF-TOKEN': this.authService.csrfToken || ''
                },
                url: '/map_module/backgroundUploads/upload/.json',
                removedfile: (file: Dropzone.DropzoneFile) => {
                    this.cdr.markForCheck();
                },
                sending: (file: Dropzone.DropzoneFile, xhr: XMLHttpRequest, formData: FormData) => {
                    this.cdr.markForCheck();
                },
                success: (file: Dropzone.DropzoneFile) => {
                    this.cdr.markForCheck();

                    const response = file.xhr;

                    let errorMessage: undefined | string = undefined;
                    if (response) {
                        const serverResponse = JSON.parse(response.response);

                        if (serverResponse.response.success) {
                            // Update the preview element to show check mark icon
                            this.updatePreviewElement(file, 'success');

                            this.notyService.genericSuccess(
                                serverResponse.response.message
                            );
                            this.loadBackgroundImages(serverResponse.response.filename);
                            return;
                        }

                        if (serverResponse.response.message) {
                            errorMessage = serverResponse.response.message;
                        }
                    }

                    // Update the preview element to show the error message and the X icon
                    this.updatePreviewElement(file, 'error', errorMessage);
                    this.notyService.genericError(errorMessage);

                },
                error: (file: Dropzone.DropzoneFile, error: string | any, xhr: XMLHttpRequest) => {
                    this.cdr.markForCheck();

                    let message = '';
                    if (typeof error === 'string') {
                        message = error;
                    } else {
                        // Error is an object
                        // "error" contains now the server response
                        // This happens if you upload a wrong file type like ".exe" or ".pdf"
                        message = "Unknown server error";
                        if (error.hasOwnProperty('error')) {
                            message = error.error;
                        }
                    }

                    // Update the preview element to show the error message and the X icon
                    this.updatePreviewElement(file, 'error', message);

                    if (typeof xhr === 'undefined') {
                        // User tried to upload illegal file types such as .pdf or so
                        this.notyService.genericError(message);
                    } else {
                        // File got uploaded to the server, but server returned an error
                        let response = message as unknown as Error;
                        this.notyService.genericError(response.message);
                    }
                }
            });
        }
        let iconDropzone = this.document.getElementById('iconDropzone');
        if (iconDropzone) {
            const dropzone = new Dropzone(iconDropzone, {
                method: "post",
                maxFilesize: this.maxUploadLimit?.value, //MB
                acceptedFiles: 'image/gif,image/jpeg,image/png', //mimetypes
                paramName: "file",
                clickable: true,
                headers: {
                    'X-CSRF-TOKEN': this.authService.csrfToken || ''
                },
                url: '/map_module/backgroundUploads/icon/.json',
                removedfile: (file: Dropzone.DropzoneFile) => {
                    this.cdr.markForCheck();
                },
                sending: (file: Dropzone.DropzoneFile, xhr: XMLHttpRequest, formData: FormData) => {
                    this.cdr.markForCheck();
                },
                success: (file: Dropzone.DropzoneFile) => {
                    this.cdr.markForCheck();

                    const response = file.xhr;

                    let errorMessage: undefined | string = undefined;
                    if (response) {
                        const serverResponse = JSON.parse(response.response);

                        if (serverResponse.response.success) {
                            // Update the preview element to show check mark icon
                            this.updatePreviewElement(file, 'success');

                            this.notyService.genericSuccess(
                                serverResponse.response.message
                            );
                            this.loadIcons(serverResponse.response.filename);
                            return;
                        }

                        if (serverResponse.response.message) {
                            errorMessage = serverResponse.response.message;
                        }
                    }

                    // Update the preview element to show the error message and the X icon
                    this.updatePreviewElement(file, 'error', errorMessage);
                    this.notyService.genericError(errorMessage);

                },
                error: (file: Dropzone.DropzoneFile, error: string | any, xhr: XMLHttpRequest) => {
                    this.cdr.markForCheck();

                    let message = '';
                    if (typeof error === 'string') {
                        message = error;
                    } else {
                        // Error is an object
                        // "error" contains now the server response
                        // This happens if you upload a wrong file type like ".exe" or ".pdf"
                        message = "Unknown server error";
                        if (error.hasOwnProperty('error')) {
                            message = error.error;
                        }
                    }

                    // Update the preview element to show the error message and the X icon
                    this.updatePreviewElement(file, 'error', message);

                    if (typeof xhr === 'undefined') {
                        // User tried to upload illegal file types such as .pdf or so
                        this.notyService.genericError(message);
                    } else {
                        // File got uploaded to the server, but server returned an error
                        let response = message as unknown as Error;
                        this.notyService.genericError(response.message);
                    }
                }
            });
        }
        let iconSetDropzone = this.document.getElementById('iconsetDropzone');
        if (iconSetDropzone) {
            const dropzone = new Dropzone(iconSetDropzone, {
                method: "post",
                maxFilesize: this.maxUploadLimit?.value, //MB
                acceptedFiles: '.zip', //mimetypes
                paramName: "file",
                clickable: true,
                addRemoveLinks: true,
                headers: {
                    'X-CSRF-TOKEN': this.authService.csrfToken || ''
                },
                url: '/map_module/backgroundUploads/iconset/.json',
                removedfile: (file: Dropzone.DropzoneFile) => {
                    this.cdr.markForCheck();
                },
                sending: (file: Dropzone.DropzoneFile, xhr: XMLHttpRequest, formData: FormData) => {
                    this.cdr.markForCheck();
                },
                success: (file: Dropzone.DropzoneFile) => {
                    this.cdr.markForCheck();

                    const response = file.xhr;

                    let errorMessage: undefined | string = undefined;
                    if (response) {
                        const serverResponse = JSON.parse(response.response);

                        if (serverResponse.response.success) {
                            // Update the preview element to show check mark icon
                            this.updatePreviewElement(file, 'success');

                            this.notyService.genericSuccess(
                                serverResponse.response.message
                            );
                            this.loadIconsets(serverResponse.response.iconsetname);
                            this.uploadIconSet = false;
                            return;
                        }

                        if (serverResponse.response.message) {
                            errorMessage = serverResponse.response.message;
                        }
                    }

                    // Update the preview element to show the error message and the X icon
                    this.updatePreviewElement(file, 'error', errorMessage);
                    this.notyService.genericError(errorMessage);

                },
                error: (file: Dropzone.DropzoneFile, error: string | any, xhr: XMLHttpRequest) => {
                    this.cdr.markForCheck();

                    let message = '';
                    if (typeof error === 'string') {
                        message = error;
                    } else {
                        // Error is an object
                        // "error" contains now the server response
                        // This happens if you upload a wrong file type like ".exe" or ".pdf"
                        message = "Unknown server error";
                        if (error.hasOwnProperty('error')) {
                            message = error.error;
                        }
                    }

                    // Update the preview element to show the error message and the X icon
                    this.updatePreviewElement(file, 'error', message);

                    if (typeof xhr === 'undefined') {
                        // User tried to upload illegal file types such as .pdf or so
                        this.notyService.genericError(message);
                    } else {
                        // File got uploaded to the server, but server returned an error
                        let response = message as unknown as Error;
                        this.notyService.genericError(response.message);
                    }
                }
            });
        }
        this.cdr.markForCheck();
    }

    private updatePreviewElement(file: Dropzone.DropzoneFile, state: 'success' | 'error', tooltipMessage: string | undefined = undefined) {
        const previewElement = file.previewElement;

        previewElement.classList.remove('dz-processing');
        previewElement.classList.add(`dz-${state}`); // dz-error or dz-success

        const errorMessageElement = previewElement.children.item(3);  // .dz-error-message
        if (errorMessageElement && tooltipMessage) {
            errorMessageElement.children[0].innerHTML = tooltipMessage; // .dz-error-message span
        }
    }

    public onCurrentItemTypeObjectIdChange() {
        //Initial load objects (like hosts or services) if the user pick an object type
        //while creating a new object on the map
        let objectId = undefined;
        if (typeof this.currentItem.object_id !== 'undefined') {
            if (this.currentItem.object_id !== null && this.currentItem.object_id > 0) {
                objectId = this.currentItem.object_id;
            }
        }

        if (typeof this.currentItem.type !== "undefined") {
            if (this.currentItem.type === 'host') {
                this.loadHosts('', objectId);
            }

            if (this.currentItem.type === 'service') {
                this.loadServices('', objectId);
            }

            if (this.currentItem.type === 'hostgroup') {
                this.loadHostgroups('', objectId);
            }

            if (this.currentItem.type === 'servicegroup') {
                this.loadServicegroups('', objectId);
            }

            if (this.currentItem.type === 'map') {
                this.loadMaps('', objectId);
            }
        }

        if (this.currentItem.hasOwnProperty('gadget') && typeof objectId !== "undefined") {
            if (this.currentItem.gadget !== 'TrafficLight') {
                this.loadMetrics();
            }
        }
    };

    public getSanitizedGadgetPreviewUrl(preview: string): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(`/map_module/img/gadget_previews/${preview}`);
    }

    protected readonly parseInt = parseInt;
}
