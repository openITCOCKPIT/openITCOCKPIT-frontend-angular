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
import {
    ButtonGroupComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { Subscription } from 'rxjs';
import { ResourcegroupsSummaryService } from './resourcegroups-summary.service';
import {
    GlobalStatusSummary,
    ResourcegroupMap,
    ResourcegroupsSummaryMap,
    ResourceMap
} from './resourcegroups-summary.interface';
import { AsyncPipe, DOCUMENT, NgClass, NgIf } from '@angular/common';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { BlockLoaderComponent } from '../../../../../layouts/primeng/loading/block-loader/block-loader.component';
import Sunburst from 'sunburst-chart';
import _ from 'lodash';
import { LabelLinkComponent } from '../../../../../layouts/coreui/label-link/label-link.component';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';


@Component({
    selector: 'oitc-resourcegroups-summary',
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        BackButtonDirective,
        RowComponent,
        ColComponent,
        AsyncPipe,
        NgIf,
        BlockLoaderComponent,
        ButtonGroupComponent,
        NgClass,
        LabelLinkComponent,
        TranslocoPipe,
        FaStackComponent,
        FaStackItemSizeDirective,
        NoRecordsComponent
    ],
    templateUrl: './resourcegroups-summary.component.html',
    styleUrl: './resourcegroups-summary.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcegroupsSummaryComponent implements OnInit, OnDestroy {
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);
    private readonly document = inject(DOCUMENT);
    private readonly ResourcegroupsSummaryService = inject(ResourcegroupsSummaryService);
    public resourcegroups!: ResourcegroupMap[];
    public mapSummary!: ResourcegroupsSummaryMap;
    public globalStatusSummary!: GlobalStatusSummary;
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private containerWidth: number = 0;

    public selectedResoucegroup: ResourcegroupMap | undefined = undefined;
    public selectedResouce: ResourceMap | undefined = undefined;
    public selectedResouceId: number | null = null;
    public sunburstChartInstance: any = null;

    @ViewChild('scmSummaryContainer') scmSummaryContainer?: ElementRef;

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);
            this.load();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public load() {
        this.subscriptions.add(this.ResourcegroupsSummaryService.getSummary()
            .subscribe((result) => {
                this.resourcegroups = result.resourcegroups;
                this.mapSummary = result.mapSummary;
                this.globalStatusSummary = result.globalStatusSummary;
                this.renderSunburstChart();
                this.cdr.markForCheck();
            })
        );
    }

    private renderSunburstChart() {
        const sunburstChartElement = this.document.getElementById('sunburstchart');
        if (this.scmSummaryContainer && this.scmSummaryContainer?.nativeElement) {
            this.containerWidth = this.scmSummaryContainer?.nativeElement.offsetWidth;
        }
        if (sunburstChartElement) {
            if (!this.sunburstChartInstance) {
                this.sunburstChartInstance = new Sunburst(this.scmSummaryContainer?.nativeElement)
                    .data(this.mapSummary)
                    .excludeRoot(true)
                    .centerRadius(0.1)
                    .sort((a, b) => a['data'].state - b['data'].state)
                    .size('size')
                    .color('color')
                    .strokeColor('white')
                    .width(this.containerWidth * 0.95)
                    .height(this.containerWidth * 0.95)
                    .radiusScaleExponent(1)
                    .tooltipContent(function (d, node) {
                        return node.depth === 0 ? '<i class="fa-solid fa-reply"></i>' : '';
                    })
                    .handleNonFittingLabel((label, availablePx) => {
                        const numFitChars = Math.round(availablePx / 7); // ~7px per char
                        return numFitChars < 5
                            ? null
                            : `${label.slice(0, Math.round(numFitChars) - 3)}...`;
                    })
                    .onClick((node, event) => {
                        if (node) {
                            if (node['type'] === 'resourcegroup') {
                                this.selectedResouceId = null;
                                this.selectedResoucegroup = _.find(this.resourcegroups, function (resourcegroup) {
                                    return resourcegroup.id == node['id'];
                                });
                                if (node.children && node.children.length > 0) {
                                    this.sunburstChartInstance.focusOnNode(node);
                                }
                                this.cdr.markForCheck();

                            } else if (node['type'] === 'resource') {
                                this.selectedResoucegroup = _.find(this.resourcegroups, function (resourcegroup) {
                                    return resourcegroup.id == node['resourcegroup_id'];
                                });
                                if (this.selectedResoucegroup && this.selectedResoucegroup.resources) {
                                    this.selectedResouce = _.find(this.selectedResoucegroup.resources, function (resource) {
                                        return resource.id == node['id'];
                                    });
                                }

                                //set focus on resource group as parent of resource
                                if (node.__dataNode && node.__dataNode.parent) {
                                    this.sunburstChartInstance.focusOnNode(node.__dataNode.parent.data);
                                    this.selectedResouceId = node['id'];
                                }
                                this.cdr.markForCheck();

                            } else {
                                this.selectedResouceId = null;
                                this.sunburstChartInstance.focusOnNode(null);
                                this.cdr.markForCheck();
                            }
                        }
                    });
            }
            this.cdr.markForCheck();
        }
    }
}
