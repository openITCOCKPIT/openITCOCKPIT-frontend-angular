import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    effect,
    inject,
    input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {
    EFConnectableSide,
    EFConnectionBehavior,
    EFConnectionType,
    EFLayoutDirection,
    EFLayoutMode,
    FBackgroundComponent,
    FCanvasComponent,
    FFlowComponent,
    FFlowModule,
    FZoomDirective,
    provideFLayout
} from '@foblex/flow';

import { Subscription } from 'rxjs';
import { HostdependenciesTree } from './hostdependencies-tree.interface';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';
import { HostdependenciesTreeService } from './hostdependencies-tree.service';


import { DagreLayoutEngine } from '@foblex/flow-dagre-layout';
import { Point } from '@foblex/2d';
import { FilterPipe } from '../../../pipes/filter.pipe';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { HoststatusIconComponent } from '../../hosts/hoststatus-icon/hoststatus-icon.component';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass } from '@angular/common';

@Component({
    selector: 'oitc-hostdependencies-tree',
    imports: [
        FBackgroundComponent,
        FCanvasComponent,
        FFlowComponent,
        FFlowModule,
        FZoomDirective,
        BlockLoaderComponent,
        FilterPipe,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        TranslocoDirective,
        HoststatusIconComponent,
        LabelLinkComponent,
        RowComponent,
        ColComponent,
        FaIconComponent,
        NgClass
    ],
    templateUrl: './hostdependencies-tree.component.html',
    styleUrl: './hostdependencies-tree.component.scss',
    providers: [
        // FIX FÜR FEHLER 2: Die Optionen werden direkt hier im Konfigurationsobjekt übergeben!
        provideFLayout(DagreLayoutEngine, {
            mode: EFLayoutMode.AUTO,
            options: {
                direction: EFLayoutDirection.LEFT_RIGHT, // 'TB'
                nodeGap: 40,
                layerGap: 160
            }
        }),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostdependenciesTreeComponent implements OnInit, OnDestroy, OnChanges {
    constructor(private layoutEngine: DagreLayoutEngine) {
        // Writeback für die automatischen Positionen
        this.layoutEngine.setWriteback((nodePositions: any) => {
            if (!this.dependenciesTree?.hostdependenciesTree.nodes || !nodePositions?.nodes) return;

            this.dependenciesTree.hostdependenciesTree.nodes.forEach((node: any) => {
                const calculated = nodePositions.nodes.find((p: any) => p.id === node.id);
                if (calculated) {
                    node.position = calculated.position;
                }
            });
        });
        effect(() => {
            const hostId = this.hostId();
            this.dependenciesTree = undefined; // Reset the tree when hostId changes
            this.load();
        });
    }

    @ViewChild(FFlowComponent, {static: false})
    public fFlowComponent!: FFlowComponent;

    @ViewChild(FCanvasComponent, {static: false}) fCanvas!: FCanvasComponent;

    @ViewChild(FZoomDirective, {static: true})
    public fZoomDirective!: FZoomDirective;
    private readonly subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    public hostId = input<number>(0);

    private HostdependenciesTreeService = inject(HostdependenciesTreeService);
    public dependenciesTree?: HostdependenciesTree;

    public ngOnInit(): void {
        this.load();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        // Parent component wants to trigger an update
        if (changes['lastUpdated'] && !changes['lastUpdated'].isFirstChange()) {
            //this.load();
            return;
        }
    }

    private load() {
        this.subscriptions.add(this.HostdependenciesTreeService.loadDependencyTree(this.hostId())
            .subscribe((result: HostdependenciesTree) => {
                this.dependenciesTree = result;
                this.cdr.markForCheck();
            }));
    };

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    protected loaded() {
        this.hostStatusMap();
        if (this.fCanvas) {
            setTimeout(() => {
                this.fCanvas.fitToScreen(new Point(10, 50), false);
            }, 50);
        }
    }

    protected hostStatusMap = computed(() => {
        const map: Record<string, string | null> = {};
        this.dependenciesTree?.hostdependenciesTree.nodes.forEach(node => {
            if (node.type === 'host' && node.Hoststatus !== undefined) {
                map[node.id] = node.Hoststatus.humanState !== undefined && node.Hoststatus.humanState !== null ? String(node.Hoststatus.humanState) : null;
            }
        });
        this.cdr.markForCheck();
        return map;
    });

    protected readonly String = String;
    protected readonly EFConnectableSide = EFConnectableSide;
    protected readonly EFConnectionBehavior = EFConnectionBehavior;
    protected readonly EFConnectionType = EFConnectionType;
}
