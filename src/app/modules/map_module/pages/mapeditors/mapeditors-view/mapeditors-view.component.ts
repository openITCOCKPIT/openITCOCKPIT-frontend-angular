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
import { ActivatedRoute, RouterLink } from '@angular/router';
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
import { parseInt } from 'lodash';
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
    private route = inject(ActivatedRoute);
    public errors: GenericValidationError | null = null;
    private cdr = inject(ChangeDetectorRef);

    public map!: MapeditorsViewMap;
    private init = true;
    protected mapId: number = 0;
    private rotate: null | string | string[] = null;

    protected fullscreen: boolean = false;
    private rotationInterval: number = 0;
    private rotationPosition: number = 1;

    private interval = null;
    private refreshInterval: number = 0;

    public ngOnInit(): void {
        this.mapId = Number(this.route.snapshot.paramMap.get('id'));
        this.fullscreen = (this.route.snapshot.paramMap.get('fullscreen') === 'true');
        let rotationParam = this.route.snapshot.paramMap.get('rotation');
        if (rotationParam != null) this.rotate = rotationParam;
        let intervalParam = this.route.snapshot.paramMap.get('interval');
        if (intervalParam != null) {
            this.rotationInterval = parseInt(intervalParam, 10) * 1000;
        }
        this.loadMapDetails();

        if (this.rotate !== null && this.rotationInterval > 0) {
            if (typeof this.rotate === "string") {
                this.rotate = this.rotate.split(',');
            }

            this.intervalSubscription = interval(this.rotationInterval).subscribe(() => {
                this.rotationPosition++;
                if (this.rotate != null && (this.rotationPosition > this.rotate.length)) {
                    this.rotationPosition = 1;
                }

                if (this.rotate != null) {
                    this.mapId = Number(this.rotate[this.rotationPosition - 1]);
                }
                this.loadMapDetails();
                this.cdr.markForCheck();
            });
        }
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        if (this.intervalSubscription) {
            this.intervalSubscription.unsubscribe();
        }
        this.toggleFullscreenMode(false, true);
        this.cdr.markForCheck();
    }

    public ngAfterViewInit(): void {
        this.toggleFullscreenMode(true);
    }

    private loadMapDetails() {
        this.subscriptions.add(this.MapeditorsService.loadMapDetails(this.mapId)
            .subscribe((result) => {
                this.map = result.map;
                this.refreshInterval = this.map.Map.refresh_interval!;
                if (this.refreshInterval !== 0 && this.refreshInterval < 5000) {
                    this.refreshInterval = 5000;
                }
                this.init = false;
                this.cdr.markForCheck();
            }));
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
