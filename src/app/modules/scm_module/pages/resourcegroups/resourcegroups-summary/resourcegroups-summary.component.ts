import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DOCUMENT,
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
    RowComponent,
    TextColorDirective
} from '@coreui/angular';
import { FaIconComponent, FaLayersComponent } from '@fortawesome/angular-fontawesome';
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
import { AsyncPipe, NgClass } from '@angular/common';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { BlockLoaderComponent } from '../../../../../layouts/primeng/loading/block-loader/block-loader.component';
import { LabelLinkComponent } from '../../../../../layouts/coreui/label-link/label-link.component';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import { SunburstEchartComponent } from '../../../../../components/charts/sunburst-echart/sunburst-echart.component';


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
        BlockLoaderComponent,
        ButtonGroupComponent,
        NgClass,
        LabelLinkComponent,
        TranslocoPipe,
        NoRecordsComponent,
        FaLayersComponent,
        TextColorDirective,
        SunburstEchartComponent
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
    public mapSummary: ResourcegroupsSummaryMap[] = [];
    public globalStatusSummary!: GlobalStatusSummary;
    public PermissionsService: PermissionsService = inject(PermissionsService);

    public selectedResoucegroup: ResourcegroupMap | undefined = undefined;
    public selectedResource: ResourceMap | undefined = undefined;
    public selectedResourceId: number | null = null;

    @ViewChild('scmSummaryContainer') scmSummaryContainer?: ElementRef;

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            this.load();
        }));
    }

    public selectResourcegroup(event: ResourcegroupMap | undefined) {
        this.selectedResoucegroup = event;
    }

    public selectResource(event: ResourceMap | undefined) {
        this.selectedResource = event;
    }

    public selectResourceId(event: number | null) {
        this.selectedResourceId = event;
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
                this.cdr.markForCheck();
            })
        );
    }
}
