import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormControlDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    ProgressComponent,
    RowComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { DecimalPipe, DOCUMENT, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { StatusmapService } from '../statusmap.service';
import { getDefaultStatusmapsIndexParams, StatusmapsIndexParmas } from '../statusmap.interface';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DebounceDirective } from '../../../directives/debounce.directive';
import {
    RegexHelperTooltipComponent
} from '../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import { Edge, Network, Node, Options } from 'vis-network';
import { DataSet } from 'vis-data/peer';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'oitc-statusmaps-index',
    standalone: true,
    imports: [
        BackButtonDirective,
        BlockLoaderComponent,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        CoreuiComponent,
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
        XsButtonDirective,
        RouterLink,
        FormControlDirective,
        FormErrorDirective,
        FormLabelDirective,
        ReactiveFormsModule,
        FormsModule,
        DebounceDirective,
        RegexHelperTooltipComponent,
        NoRecordsComponent,
        FaIconComponent
    ],
    templateUrl: './statusmaps-index.component.html',
    styleUrl: './statusmaps-index.component.css'
})
export class StatusmapsIndexComponent implements OnInit, OnDestroy {

    public sattelites: SelectKeyValue[] = [];
    public params: StatusmapsIndexParmas = getDefaultStatusmapsIndexParams();
    public isLoading: boolean = false;
    public isEmpty: boolean = false;
    public considerParentChildRelations: boolean = true;

    // Progress is only necessary if physics is enabled
    public showProgressbar: boolean = false;
    public progress: number = 0;

    private subscriptions: Subscription = new Subscription();
    public readonly PermissionsService = inject(PermissionsService);
    private readonly StatusmapService = inject(StatusmapService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly modalService = inject(ModalService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly document = inject(DOCUMENT);


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
            const edges = statusmap.statusMap.edges;
            const nodes = statusmap.statusMap.nodes;

            this.isEmpty = nodes.length === 0;

            this.sattelites = statusmap.satellites;
            this.isLoading = false;

            this.renderVisNetwork(edges, nodes);
        }));
    }

    private renderVisNetwork(edgesData: Edge[], nodesData: Node[]): void {
        const elem = this.document.getElementById('statusmapNetwork');
        if (!elem) {
            // Just to make TS happy
            return;
        }

        let nodes: DataSet<Node> = new DataSet<Node>();
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
            });
            network.once('stabilizationIterationsDone', () => {
                this.showProgressbar = false;
                network.setOptions({physics: false});
            });
        }

        network.on('click', (params) => {
            console.log("Clicked on", params.nodes);
        });
    }

}
