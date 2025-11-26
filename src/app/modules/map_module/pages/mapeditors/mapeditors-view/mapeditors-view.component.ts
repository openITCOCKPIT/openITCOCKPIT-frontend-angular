import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnDestroy,
    OnInit
} from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GenericValidationError } from '../../../../../generic-responses';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { MapeditorsService } from '../mapeditors.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { MapeditorsViewMap } from '../mapeditors.interface';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { NgClass, NgIf } from '@angular/common';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { MapViewComponent } from '../../../components/map-view/map-view.component';
import { SidebarService } from '../../../../../layouts/coreui/coreui-navbar/sidebar.service';

@Component({
    selector: 'oitc-mapeditors-view',
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
        NgIf,
        XsButtonDirective,
        MapViewComponent,
        NgClass
    ],
    templateUrl: './mapeditors-view.component.html',
    styleUrl: './mapeditors-view.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapeditorsViewComponent implements OnInit, OnDestroy, AfterViewInit {

    private subscriptions: Subscription = new Subscription();
    private intervalSubscription: Subscription = new Subscription();
    private MapeditorsService: MapeditorsService = inject(MapeditorsService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    readonly sidebarService: SidebarService = inject(SidebarService);
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    public errors: GenericValidationError | null = null;
    private cdr = inject(ChangeDetectorRef);

    public map!: MapeditorsViewMap;
    protected mapId: number = 0;
    protected rotate: string[] = [];

    protected fullscreen: boolean = false;
    private rotationInterval: number = 0;
    private rotationPosition: number = 1;
    protected intervalParam: number = 0;

    private interval = null;
    private refreshInterval: number = 0;

    public ngOnInit(): void {

        this.subscriptions.add(this.route.params.subscribe(params => {

            this.mapId = Number(params['id'] ?? 0);
            this.fullscreen = (params['fullscreen'] ?? 'false') === 'true';

            let rotationParam = params['rotation']
            if (rotationParam) {
                this.rotate = String(rotationParam).split(',');
            }

            this.intervalParam = Number(params['interval'] ?? 0);
            if (isNaN(this.intervalParam) || this.intervalParam <= 0) {
                this.intervalParam = 90;
            }
            this.rotationInterval = this.intervalParam * 1000;


            // Load the current map / first map of a rotation
            this.loadMapDetails();
            this.cdr.markForCheck();

            if (this.rotate.length > 0 && !this.rotate.includes("0")) {
                // Handle map rotations
                this.intervalSubscription = interval(this.rotationInterval).subscribe(() => {
                    this.rotationPosition++;
                    if (this.rotate != null && (this.rotationPosition > this.rotate.length)) {
                        this.rotationPosition = 1;
                    }

                    this.mapId = Number(this.rotate[this.rotationPosition - 1]);

                    this.loadMapDetails();
                    this.cdr.markForCheck();
                });
            }
        }));


    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.intervalSubscription.unsubscribe();
        this.toggleFullscreenMode(false, true);
        this.cdr.markForCheck();
    }

    public ngAfterViewInit(): void {
        this.toggleFullscreenMode(true);
    }

    private loadMapDetails() {
        if (this.mapId) {
            this.subscriptions.add(this.MapeditorsService.loadMapDetails(this.mapId)
                .subscribe((result) => {
                    this.map = result.map;
                    this.refreshInterval = this.map.Map.refresh_interval!;
                    if (this.refreshInterval !== 0 && this.refreshInterval < 5000) {
                        this.refreshInterval = 5000;
                    }
                    this.cdr.markForCheck();
                }));
        }
    };

    public toggleFullscreenMode(initialLoad: boolean = false, leavePage: boolean = false) {
        let sidebarVisible = this.sidebarService.isSidebarVisible();

        if (leavePage) {
            if (this.fullscreen && !sidebarVisible) {
                this.sidebarService.toggleShowOrHideSidebar();
            }
            return;
        }

        if (initialLoad) {
            if (this.fullscreen && sidebarVisible || !this.fullscreen && !sidebarVisible) {
                this.sidebarService.toggleShowOrHideSidebar();
            }
        } else {
            if (!this.fullscreen && sidebarVisible || this.fullscreen && !sidebarVisible) {
                this.sidebarService.toggleShowOrHideSidebar();
            }
            this.fullscreen = !this.fullscreen;
        }
        this.cdr.markForCheck();
    }

}
