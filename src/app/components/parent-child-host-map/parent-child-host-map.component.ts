import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DOCUMENT,
    inject,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { HostBrowserResult } from '../../pages/hosts/hosts.interface';
import { LayoutService } from '../../layouts/coreui/layout.service';
import { Edge, Network, Node, Options } from 'vis-network';
import { StatusmapExtendedNode } from '../../pages/statusmaps/statusmap.interface';
import { DataSet } from 'vis-data';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'parent-child-host-map',
    imports: [
        TranslocoDirective
    ],
    templateUrl: './parent-child-host-map.component.html',
    styleUrl: './parent-child-host-map.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParentChildHostMapComponent implements AfterViewInit, OnChanges {

    private cdr = inject(ChangeDetectorRef);
    private readonly document = inject(DOCUMENT);
    private subscriptions: Subscription = new Subscription();
    private readonly LayoutService: LayoutService = inject(LayoutService);
    private readonly router = inject(Router);
    public theme: string = '';
    private nodes: DataSet<Node> = new DataSet<StatusmapExtendedNode>();
    private edges: DataSet<Edge> = new DataSet<Edge>();

    @Input() result?: HostBrowserResult;

    constructor() {
        this.subscriptions.add(this.LayoutService.theme$.subscribe((theme) => {
            this.theme = '';
            if (theme === 'dark') {
                this.theme = 'dark';
            }
            this.ngAfterViewInit();
        }));
    }


    ngOnChanges(changes: SimpleChanges): void {
        this.ngAfterViewInit();
    }

    public ngAfterViewInit() {
        if (!this.result) {
            console.warn('Geht net, weil RESULT fehlt');
            return;
        }
        if (this.result.parentChildRelations.edges === null) {
            console.warn('Geht net, weil edges fehlt');
            return;
        }
        if (this.result.parentChildRelations.nodes === null) {
            console.warn('Geht net, weil nodes fehlt');
            return;
        }

        const elem = this.document.getElementById('ParentChildHostMapComponent');
        if (!elem) {
            console.warn('Geht net, weil elem fehlt');
            // Just to make TS happy
            return;
        }

        this.nodes.clear();
        this.edges.clear();

        this.nodes.add(this.result.parentChildRelations.nodes);
        this.edges.add(this.result.parentChildRelations.edges);

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
        // Hier dark /Light switch wichtig
        const colorBackground: string = this.theme === 'dark' ? "rgba(37, 43, 54, 1)" : "rgba(255, 255, 255, 1)";
        const colorText: string = this.theme === 'dark' ? "rgba(255, 255, 255, 0.87)" : "rgba(37, 43, 54, 0.95)";

        let options: Options = {
            autoResize: true,
            height: '250px', // I can't stress enough how important the height parameter is!
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
                    color: {
                        border: colorNotMonitored,
                        background: colorBackground
                    },
                    borderWidth: 2,
                    font: {
                        color: colorText
                    },
                    size: 15,
                },
                disabled: {
                    shape: 'dot',
                    color: {
                        border: colorNotMonitored,
                        background: colorBackground
                    },
                    borderWidth: 2,
                    font: {
                        color: colorText
                    },
                    size: 15,
                },
                hostUp: {
                    shape: 'dot',
                    color: {
                        border: colorUp,
                        background: colorBackground
                    },
                    borderWidth: 2,
                    font: {
                        color: colorText
                    },
                    size: 15,
                },
                hostDown: {
                    shape: 'dot',
                    color: {
                        border: colorDown,
                        background: colorBackground
                    },
                    borderWidth: 2,
                    font: {
                        color: colorText
                    },
                    size: 15,
                },
                hostUnreachable: {
                    shape: 'dot',
                    color: {
                        border: colorDown,
                        background: colorBackground
                    },
                    borderWidth: 2,
                    font: {
                        color: colorText
                    },
                    size: 15,
                },
                isInDowntimeUp: {
                    shape: 'dot',
                    color: {
                        border: colorUp,
                        background: colorBackground
                    },
                    borderWidth: 2,
                    font: {
                        color: colorText
                    },
                    size: 15,
                },
                isInDowntimeDown: {
                    shape: 'dot',
                    color: {
                        border: colorDown,
                        background: colorBackground
                    },
                    borderWidth: 2,
                    font: {
                        color: colorText
                    },
                    size: 15,
                },
                isInDowntimeUnreachable: {
                    shape: 'dot',
                    color: {
                        border: colorUnreachable,
                        background: colorBackground
                    },
                    borderWidth: 2,
                    font: {
                        color: colorText
                    },
                    size: 15,
                },
                isAcknowledgedUp: {
                    shape: 'dot',
                    color: {
                        border: colorUp,
                        background: colorBackground
                    },
                    borderWidth: 2,
                    font: {
                        color: colorText
                    },
                    size: 15,
                },
                isAcknowledgedDown: {
                    shape: 'dot',
                    color: {
                        border: colorDown,
                        background: colorBackground
                    },
                    borderWidth: 2,
                    font: {
                        color: colorText
                    },
                    size: 15,
                },
                isAcknowledgedUnreachable: {
                    shape: 'dot',
                    color: {
                        border: colorUnreachable,
                        background: colorBackground
                    },
                    borderWidth: 2,
                    font: {
                        color: colorText
                    },
                    size: 15,
                },
                isAcknowledgedAndIsInDowntimeUp: {
                    shape: 'dot',
                    color: {
                        border: colorUp,
                        background: colorBackground
                    },
                    borderWidth: 2,
                    font: {
                        color: colorText
                    },
                    size: 15,
                },
                isAcknowledgedAndIsInDowntimeDown: {
                    shape: 'dot',
                    color: {
                        border: colorDown,
                        background: colorBackground
                    },
                    borderWidth: 2,
                    font: {
                        color: colorText
                    },
                    size: 15,
                },
                isAcknowledgedAndIsInDowntimeUnreachable: {
                    shape: 'dot',
                    color: {
                        border: colorUnreachable,
                        background: colorBackground
                    },
                    borderWidth: 2,
                    font: {
                        color: colorText
                    },
                    size: 15,
                },
            },
            nodes: {
                borderWidth: 0.5,
                font: {
                    color: colorText,
                    align: "left" // GEHT NICHT
                }
            },
            edges: {
                width: 1,
                smooth: {
                    enabled: true,
                    type: "cubicBezier",
                    forceDirection: "horizontal",
                    roundness: .8
                }
            },
            interaction: {
                hover: false,
                zoomView: false,   // disables zooming (mouse wheel + pinch)
                dragView: false,   // disables moving/panning the canvas
                dragNodes: false,
                keyboard: {
                    enabled: false
                },
                hideEdgesOnDrag: true
            },
            layout: {
                randomSeed: 1000,
                improvedLayout: false,
                hierarchical: {
                    enabled: true,
                    direction: 'LR',
                    nodeSpacing: 40,
                    levelSeparation: 500,
                    sortMethod: "directed",
                    shakeTowards: "roots",
                    parentCentralization: false,
                    treeSpacing: 200,
                }
            },
            physics: false
        };
        const network = new Network(elem, {nodes: this.nodes, edges: this.edges}, options);
        network.fit({
            animation: {
                duration: 500,
                easingFunction: 'linear'
            }
        });

        network.on('click', (properties) => {
            if (properties.nodes[0]) {
                // @todo: Achtun bullshit detected (replace...) Geht doch irgendwie auch mit nem zusätzlichen Feld ?
                this.router.navigate(['hosts', 'browser', properties.nodes[0].replace('Host_', '')]);
            }
        });
        this.cdr.markForCheck();
    }

}
