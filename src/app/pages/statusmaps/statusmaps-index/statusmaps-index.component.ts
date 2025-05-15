import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';

import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormCheckInputDirective,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    ProgressBarComponent,
    ProgressComponent,
    RowComponent,
    ToastBodyComponent,
    ToastComponent,
    ToasterComponent,
    ToastHeaderComponent
} from '@coreui/angular';
import { DecimalPipe, DOCUMENT, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { PermissionsService } from '../../../permissions/permissions.service';
import { StatusmapService } from '../statusmap.service';
import { getDefaultStatusmapsIndexParams, StatusmapExtendedNode, StatusmapsIndexParmas } from '../statusmap.interface';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DebounceDirective } from '../../../directives/debounce.directive';

import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import { Edge, Network, Node, Options } from 'vis-network';
import { DataSet } from 'vis-data/peer';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';


import { SummaryState } from '../../hosts/summary_state.interface';
import { HostEntity } from '../../hosts/hosts.interface';
import { HostSummaryStatusmapComponent } from './host-summary-statusmap/host-summary-statusmap.component';
import { LayoutService } from '../../../layouts/coreui/layout.service';

@Component({
    selector: 'oitc-statusmaps-index',
    imports: [
        BlockLoaderComponent,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        DecimalPipe,
        FaIconComponent,
        InputGroupComponent,
        InputGroupTextDirective,
        NavComponent,
        NavItemComponent,
        NgIf,
        PermissionDirective,
        ProgressComponent,
        RowComponent,
        SelectComponent,
        TranslocoDirective,
        TranslocoPipe,
        RouterLink,
        FormControlDirective,
        ReactiveFormsModule,
        FormsModule,
        DebounceDirective,
        NoRecordsComponent,
        FaIconComponent,
        ProgressBarComponent,
        ToastBodyComponent,
        ToastComponent,
        ToastHeaderComponent,
        ToasterComponent,
        HostSummaryStatusmapComponent,
        FormCheckInputDirective
    ],
    templateUrl: './statusmaps-index.component.html',
    styleUrl: './statusmaps-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusmapsIndexComponent implements OnInit, OnDestroy {

    public sattelites: SelectKeyValue[] = [];
    public params: StatusmapsIndexParmas = getDefaultStatusmapsIndexParams();
    public isLoading: boolean = false;
    public isEmpty: boolean = false;
    public considerParentChildRelations: boolean = true;

    // Host details toast
    public toastVisible: boolean = false;
    public toastPercentage: number = 0;
    public hostSummaryState?: SummaryState;
    public toastHost?: HostEntity;

    // Progress is only necessary if physics is enabled
    public showProgressbar: boolean = false;
    public progress: number = 0;
    public theme: null | 'dark' = null;
    private edges: Edge[] = [];
    private nodes: StatusmapExtendedNode[] = [];

    private subscriptions: Subscription = new Subscription();
    public readonly PermissionsService = inject(PermissionsService);
    private readonly StatusmapService = inject(StatusmapService);
    private readonly LayoutService = inject(LayoutService);
    private readonly route = inject(ActivatedRoute);
    private readonly document = inject(DOCUMENT);
    private cdr = inject(ChangeDetectorRef);


    constructor() {
        this.subscriptions.add(this.LayoutService.theme$.subscribe((theme) => {
            this.theme = null;
            if (theme === 'dark') {
                this.theme = 'dark';
            }
            this.renderVisNetwork(this.edges, this.nodes);
            this.cdr.markForCheck();
        }));
    }

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            this.load();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public onSatelliteChange() {
        this.load();
    }

    public onFilterChange($event: any) {
        this.load();
    }

    public load() {
        this.params.showAll = !this.considerParentChildRelations;

        this.isLoading = true;
        this.subscriptions.add(this.StatusmapService.getIndex(this.params).subscribe(statusmap => {
            this.edges = statusmap.statusMap.edges;
            this.nodes = statusmap.statusMap.nodes;

            this.isEmpty = this.nodes.length === 0;

            this.sattelites = statusmap.satellites;
            this.isLoading = false;
            this.cdr.markForCheck();

            this.renderVisNetwork(this.edges, this.nodes);

            if (this.isEmpty) {
                this.showProgressbar = false;
            }

        }));
    }

    private renderVisNetwork(edgesData: Edge[] | null, nodesData: StatusmapExtendedNode[] | null): void {

        if (edgesData === null || nodesData === null) {
            return;
        }

        const elem = this.document.getElementById('statusmapNetwork');
        if (!elem) {
            // Just to make TS happy
            return;
        }

        let nodes: DataSet<Node> = new DataSet<StatusmapExtendedNode>();
        let edges: DataSet<Edge> = new DataSet<Edge>();

        nodes.clear();
        edges.clear();

        nodes.add(nodesData);
        edges.add(edgesData);

        const rect = elem.getBoundingClientRect();
        const offset = {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX
        };
        if (offset.top < 0) {
            offset.top = 0;
        }

        const colorUp = '#00C851';
        const colorDown = '#CC0000';
        const colorUnreachable = '#727b84';
        const colorNotMonitored = '#4285F4';

        const labelFontColor: string = this.theme === 'dark' ? "rgba(255, 255, 255, 0.87)" : "rgba(37, 43, 54, 0.95)";

        let options: Options = {
            autoResize: true,
            height: String(window.innerHeight - offset.top) + 'px', // I can't stress enough how important the height parameter is!
            width: "100%",
            clickToUse: false,
            groups: {
                satellite: {
                    shape: 'ellipse',
                    margin: {
                        top: 10,
                        bottom: 20,
                        left: 5,
                        right: 5
                    }
                },
                notMonitored: {
                    shape: 'dot',
                    color: colorNotMonitored,
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf070',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                disabled: {
                    shape: 'dot',
                    color: colorNotMonitored,
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf1e6',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                hostUp: {
                    shape: 'dot',
                    color: colorUp,
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf058',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                hostDown: {
                    shape: 'dot',
                    color: colorDown,
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf06a',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                hostUnreachable: {
                    shape: 'dot',
                    color: colorDown,
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf059',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                isInDowntimeUp: {
                    shape: 'dot',
                    color: colorUp,
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf011',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                isInDowntimeDown: {
                    shape: 'dot',
                    color: colorDown,
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf011',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                isInDowntimeUnreachable: {
                    shape: 'dot',
                    color: colorUnreachable,
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf011',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                isAcknowledgedUp: {
                    shape: 'dot',
                    color: colorUp,
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf007',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                isAcknowledgedDown: {
                    shape: 'dot',
                    color: colorDown,
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf007',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                isAcknowledgedUnreachable: {
                    shape: 'dot',
                    color: colorUnreachable,
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf007',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                isAcknowledgedAndIsInDowntimeUp: {
                    shape: 'dot',
                    color: colorUp,
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf0f0',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                isAcknowledgedAndIsInDowntimeDown: {
                    shape: 'dot',
                    color: colorDown,
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf0f0',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                isAcknowledgedAndIsInDowntimeUnreachable: {
                    shape: 'dot',
                    color: colorUnreachable,
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf0f0',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
            },
            nodes: {
                borderWidth: 0.5,
                font: {
                    color: labelFontColor
                }
            },
            edges: {
                width: 0.2,
                smooth: false,
            },
            physics: {
                forceAtlas2Based: {
                    gravitationalConstant: -138,
                    centralGravity: 0.02,
                    springLength: 100
                },
                minVelocity: 0.75,
                solver: "forceAtlas2Based",
            },
            interaction: {
                hover: true,
                dragNodes: false,
                keyboard: {
                    enabled: false
                },
                hideEdgesOnDrag: true

            },
            layout: {
                randomSeed: 1000,
                improvedLayout: false
            }
        };

        if (options.physics) {
            this.showProgressbar = true;
            this.progress = 0;
        }

        const network = new Network(elem, {nodes: nodes, edges: edges}, options);
        network.fit({
            animation: {
                duration: 500,
                easingFunction: 'linear'
            }
        });

        if (options.physics) {
            network.on('stabilizationProgress', (params) => {
                let currentPercentage = Math.round(params.iterations / params.total * 100);
                this.progress = currentPercentage;
                this.cdr.markForCheck();
            });
            network.once('stabilizationIterationsDone', () => {
                this.showProgressbar = false;
                network.setOptions({physics: false});
                this.cdr.markForCheck();
            });
        }

        network.on('click', (properties) => {
            if (properties.nodes.length === 0) {
                network.fit({
                    animation: {
                        duration: 500,
                        easingFunction: 'linear'
                    }
                });
                return;
            }

            const nodeId = properties.nodes[0];
            if (nodeId === 0) {
                return;
            }

            // @ts-ignore
            let selectedNode: StatusmapExtendedNode = nodes.get(nodeId) as StatusmapExtendedNode;
            this.toggleToast(selectedNode);
            // shared $scope with HostSummaryDirective
        });
    }

    private toggleToast(node: StatusmapExtendedNode) {

        this.toastHost = {
            id: node.hostId,
            uuid: node.uuid,
            name: String(node.title), // hostname + ip address
            disabled: node.group === 'disabled' ? 1 : 0,
        };

        if (this.toastVisible) {
            // Close any open toast
            this.toastVisible = false;
        }

        this.hostSummaryState = undefined;

        this.StatusmapService.loadHostAndServicesSummaryStatus(node.hostId).subscribe(data => {
            this.hostSummaryState = data;
            this.toastVisible = true; // Show toast
            this.cdr.markForCheck();
        });


    }

    public onToastTimerChange($event: number) {
        this.toastPercentage = $event * 25;
    }

    public onToastVisibleChange($event: boolean) {
        this.toastVisible = $event;
        if (!this.toastVisible) {
            this.toastPercentage = 0;
        }
    }

}
