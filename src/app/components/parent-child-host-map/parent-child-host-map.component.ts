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
    private readonly LayoutService: LayoutService = inject(LayoutService);
    private readonly router = inject(Router);
    public theme: string = '';
    private nodes: DataSet<Node> = new DataSet<StatusmapExtendedNode>();
    private edges: DataSet<Edge> = new DataSet<Edge>();

    @Input() result?: HostBrowserResult;


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

        const labelFontColor: string = this.theme === 'dark' ? "rgba(255, 255, 255, 0.87)" : "rgba(37, 43, 54, 0.95)";

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
                    color: colorNotMonitored,
                    size: 15,
                    icon: {
                        face: '"Font Awesome 7 Free Solid"',
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
                        face: '"Font Awesome 7 Free Solid"',
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
                        face: '"Font Awesome 7 Free Solid"',
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
                        face: '"Font Awesome 7 Free Solid"',
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
                        face: '"Font Awesome 7 Free Solid"',
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
                        face: '"Font Awesome 7 Free Solid"',
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
                        face: '"Font Awesome 7 Free Solid"',
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
                        face: '"Font Awesome 7 Free Solid"',
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
                        face: '"Font Awesome 7 Free Solid"',
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
                        face: '"Font Awesome 7 Free Solid"',
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
                        face: '"Font Awesome 7 Free Solid"',
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
                        face: '"Font Awesome 7 Free Solid"',
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
                        face: '"Font Awesome 7 Free Solid"',
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
                        face: '"Font Awesome 7 Free Solid"',
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
                    color: labelFontColor,
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
                hover: true,
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
                    direction: 'RL',
                    nodeSpacing: 40,
                    levelSeparation: 500,
                    sortMethod: "directed",
                    shakeTowards: "roots",
                    parentCentralization: false
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
            console.warn(properties.nodes[0].replace('Host_', ''));

            this.router.navigate(['hosts', 'browser', properties.nodes[0].replace('Host_', '')]);
        });
        this.cdr.markForCheck();
    }

}
