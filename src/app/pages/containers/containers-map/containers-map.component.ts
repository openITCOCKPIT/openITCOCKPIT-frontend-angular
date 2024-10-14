import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostListener,
    inject,
    OnDestroy,
    OnInit
} from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    ProgressComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DecimalPipe, DOCUMENT, NgForOf, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { ContainersService } from '../containers.service';
import { ROOT_CONTAINER } from '../../changelogs/object-types.enum';
import { Edge, Network, Node, Options } from 'vis-network';
import { DataSet } from 'vis-data/peer';
import { ClusterOptions } from 'vis-network/declarations/network/Network';

@Component({
    selector: 'oitc-containers-map',
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
        FaIconComponent,
        InputGroupComponent,
        InputGroupTextDirective,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        PermissionDirective,
        RowComponent,
        SelectComponent,
        TableDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        DecimalPipe,
        ProgressComponent,
        TranslocoPipe
    ],
    templateUrl: './containers-map.component.html',
    styleUrl: './containers-map.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainersMapComponent implements OnInit, OnDestroy {

    public selectedContainerId: number = 0;
    public containers?: SelectKeyValue[] = [];

    public isLoading: boolean = false;

    // Progress is only necessary if physics is enabled
    public showProgressbar: boolean = false;
    public progress: number = 0;

    private subscriptions: Subscription = new Subscription();
    private isFullscreen: boolean = false;
    public readonly PermissionsService = inject(PermissionsService);
    private readonly ContainersService = inject(ContainersService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly modalService = inject(ModalService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly document = inject(DOCUMENT);
    private cdr = inject(ChangeDetectorRef);

    @HostListener('fullscreenchange', ['$event'])
    handleFullscreenchangeEvent(Event: Event) {
        if (document.fullscreenElement === null) {
            this.isFullscreen = false;
        }
    }

    public ngOnInit(): void {
        this.loadContainersForSelect();

        this.subscriptions.add(this.route.params.subscribe(
            params => {
                if (params.hasOwnProperty('id')) {
                    const id = Number(params['id']);
                    if (id) {
                        this.selectedContainerId = id;
                        this.loadContainerTree();
                    }
                }
            }
        ));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private loadContainersForSelect(): void {
        this.subscriptions.add(this.ContainersService.loadAllContainers().subscribe(containers => {
            // Filter the ROOT_CONTAINER as it has to many dependencies to display
            this.containers = containers.filter(c => c.key !== ROOT_CONTAINER);
            this.cdr.markForCheck();
        }));
    }

    public onContainerChange() {
        // Update the URL with the new container ID
        // The reload will be done by the subscription to the route params
        // see ngOnInit method for details
        this.router.navigate(['/', 'containers', 'map', this.selectedContainerId], {
            queryParamsHandling: 'merge'
        });
    }

    public loadContainerTree() {
        this.isLoading = true;
        this.subscriptions.add(this.ContainersService.loadShowDetailsAsTree(this.selectedContainerId).subscribe(containerTree => {
            const edges = containerTree.containerMap.edges;
            const nodes = containerTree.containerMap.nodes;
            const cluster = containerTree.containerMap.cluster;
            this.isLoading = false;

            this.cdr.markForCheck();

            this.renderVisNetwork(edges, nodes, cluster);
        }));
    }

    private renderVisNetwork(edgesData: Edge[], nodesData: Node[], cluster: any[]): void {
        const elem = this.document.getElementById('containerNetwork');
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

        let colorGroup = '#4285F4';


        let options: Options = {
            autoResize: true,
            height: String(window.innerHeight - offset.top) + 'px', // I can't stress enough how important the height parameter is!
            width: "100%",
            clickToUse: false,
            groups: {
                root: {
                    shape: 'ellipse',
                    icon: {
                        face: '"Font Awesome 6 Free"',
                        code: '\uf0ac',
                        color: colorGroup, //color for icon,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold. // Font Awesome 6 fix https://github.com/visjs/vis-network/issues/139#issuecomment-536114158

                    },
                    margin: {
                        top: 10,
                        bottom: 20,
                        left: 5,
                        right: 5
                    },
                    color: {
                        border: 'black',
                        background: 'white',
                        highlight: {
                            border: 'yellow',
                            background: 'orange'
                        }
                    },
                    fontColor: 'red'
                },

                tenant: {
                    shape: 'icon',
                    color: '#ff4444',
                    icon: {
                        face: '"Font Awesome 6 Free"',
                        code: '\uf015',
                        size: 35,
                        color: '#ff4444',
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                location: {
                    shape: 'icon',
                    color: '#ff8800', // color for edges
                    icon: {
                        face: '"Font Awesome 6 Free"',
                        code: '\uf124',
                        size: 35,
                        color: '#ff8800',
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                node: {
                    shape: 'icon',
                    color: '#00695c', // color for edges
                    icon: {
                        face: '"Font Awesome 6 Free"',
                        code: '\uf0c1',
                        size: 35,
                        color: '#00695c',
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                devicegroup: {
                    shape: 'icon',
                    color: colorGroup, // color for edges
                    icon: {
                        face: '"Font Awesome 6 Free"',
                        code: '\uf0c1',
                        color: colorGroup, //color for icon
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                hostgroups: {
                    shape: 'dot',
                    color: '#00e676',
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf233',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                hosts: {
                    shape: 'dot',
                    color: '#007bff',
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf108',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                hosttemplates: {
                    shape: 'dot',
                    color: '#8bc34a',
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free"',
                        code: '\uf044',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                hostescalations: {
                    shape: 'dot',
                    color: '#304ffe',
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf1e2',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                hostdependencies: {
                    shape: 'dot',
                    color: '#66bb6a',
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf0e8',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                servicegroups: {
                    shape: 'dot',
                    color: '#f4511e',
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf085',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                servicetemplategroups: {
                    shape: 'dot',
                    color: '#1c2a48',
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free"',
                        code: '\uf0c5',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                servicetemplates: {
                    shape: 'dot',
                    color: '#009688',
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free"',
                        code: '\uf044',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                serviceescalations: {
                    shape: 'dot',
                    color: '#45526e',
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf1e2',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                servicedependencies: {
                    shape: 'dot',
                    color: '#0091ea',
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf0e8',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                contacts: {
                    shape: 'dot',
                    color: '#9933CC',
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free"',
                        code: '\uf2bd',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                contactgroups: {
                    shape: 'dot',
                    color: '#b388ff',
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf0c0',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                users: {
                    shape: 'dot',
                    color: '#800080',
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free"',
                        code: '\uf2bd',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                usercontainerroles: {
                    shape: 'dot',
                    color: '#800080',
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf0c0',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                timeperiods: {
                    shape: 'dot',
                    color: '#3f51b5',
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free"',
                        code: '\uf017',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                maps: {
                    shape: 'dot',
                    color: '#f50057',
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf041',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                instantreports: {
                    shape: 'dot',
                    color: '#0099CC',
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free"',
                        code: '\uf1c5',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                autoreports: {
                    shape: 'dot',
                    color: '#ab47bc',
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free"',
                        code: '\uf1c5',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                satellites: {
                    shape: 'dot',
                    color: '#01579b',
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf7bf',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
                grafana_userdashboards: {
                    shape: 'dot',
                    color: '#f05a28',
                    size: 15,
                    icon: {
                        face: '"Font Awesome 6 Free Solid"',
                        code: '\uf1fe',
                        color: '#ffffff',
                        size: 5,
                        weight: "900", // Font Awesome 5 doesn't work properly unless bold.
                    }
                },
            },
            nodes: {
                // margin: 10,
                shadow: {
                    enabled: true,
                    size: 1,
                    color: 'rgba(0,0,0,0.1)'
                },
                font: {
                    size: 12,
                    background: 'rgba(255,255,255,0.7)' // important for dark mode
                },
                // heightConstraint: {
                //    minimum: 20
                // }
            },
            layout: {
                improvedLayout: false,
                randomSeed: 1000,
            },
            interaction: {
                hover: true,
                dragNodes: true,
                keyboard: {
                    enabled: false
                },
                hideEdgesOnDrag: true
            },
            physics: {
                barnesHut: {
                    gravitationalConstant: -2000,
                    centralGravity: 0.3,
                    springLength: 95,
                    springConstant: 0.04,
                    damping: 0.09
                },
                maxVelocity: 146,
                solver: 'barnesHut',
                timestep: 0.35,
                stabilization: {
                    enabled: true,
                    iterations: 2000,
                    updateInterval: 25
                }
                /*forceAtlas2Based: {
                    gravitationalConstant: -138,
                    centralGravity: 0.02,
                    springLength: 100
                },
                minVelocity: 0.75,
                solver: "forceAtlas2Based",*/
            }
        };

        if (options.physics) {
            this.showProgressbar = true;
            this.progress = 0;
        }

        // https://github.com/visjs/vis-network/issues/1967
        // 'normal normal 900 24px/1 "Font Awesome 5 Free"'
        // 'normal 400 1em/1 "Font Awesome 6 Free"'
        //this.document.fonts.load('normal 400 1em/1 "Font Awesome 6 Free"').then(() => {
        //console.log('Font Awesome 6 Free is available');

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

                this.cdr.markForCheck();

                // Force the network to stop moving
                network.setOptions({physics: false});

                // Wait a bit before enabling physics again
                setTimeout(function () {
                    network.setOptions({physics: true});
                }, 250);
            });
        }

        network.on("selectNode", (params) => {
            if (params.nodes.length === 1) {
                if (network.isCluster(params.nodes[0]) == true) {
                    // The method .cluster() creates a cluster and .openCluster() releases the clustered nodes and
                    // edges from the cluster and then disposes of it. There's no way to close it because it no longer exists.
                    // Source: https://github.com/visjs/vis-network/issues/354#issuecomment-574260404
                    network.openCluster(params.nodes[0]);
                } else {
                    //Was a cluster and want to get closed down?
                    nodesData.forEach((node: any) => {
                        if (node.hasOwnProperty('createCluster') && node.id === params.nodes[0]) {
                            //Lookup cluster configuration
                            let clusterLabel: string = 'ERR';
                            cluster.forEach((clusterObj) => {
                                if (clusterObj.name === node.createCluster) {
                                    clusterLabel = String(clusterObj.size)
                                }
                            });

                            //Recluster
                            let clusterOptions: ClusterOptions = {
                                joinCondition(nodeOptions: any): boolean {
                                    return nodeOptions.cid === node.createCluster;
                                },
                                clusterNodeProperties: {
                                    label: clusterLabel,
                                    color: node.color || '#97c2fc'
                                }
                            };

                            network.cluster(clusterOptions);
                        }
                    });
                }
            }
        });


        //Create all vis-network clusters on page load
        if (cluster) {
            cluster.forEach((clusterData) => {
                let clusterOptions: ClusterOptions = {
                    joinCondition(nodeOptions: any): boolean {
                        return nodeOptions.cid === clusterData.name;
                    },
                    clusterNodeProperties: {
                        label: String(clusterData.size) //cast number to string otherwise it will not be displayed
                    }
                };

                network.cluster(clusterOptions);
            });
        }

        // });

    }

    public toggleFullscreenMode() {
        const elem = this.document.getElementById('fullscreenContainerMap');

        if (this.isFullscreen) {
            if (document.exitFullscreen) {
                this.isFullscreen = false;
                document.exitFullscreen();
            }
        } else {
            this.isFullscreen = true;
            if (elem && elem.requestFullscreen) {
                elem.requestFullscreen();
            }
        }
    }

}
