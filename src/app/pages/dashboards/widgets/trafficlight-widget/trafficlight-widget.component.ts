import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    signal,
    ViewChild
} from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { SelectItemOptionGroup } from '../../../../layouts/primeng/select.interface';
import { AnimationEvent } from '@angular/animations';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { TrafficlightWidgetService } from './trafficlight-widget.service';
import { ServicesService } from '../../../services/services.service';
import { ServicesLoadServicesByStringParams } from '../../../services/services.interface';
import {
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormLabelDirective
} from '@coreui/angular';
import { SelectOptgroupComponent } from '../../../../layouts/primeng/select/select-optgroup/select-optgroup.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TrueFalseDirective } from '../../../../directives/true-false.directive';
import { TrafficlightSvgComponent } from './trafficlight-svg/trafficlight-svg.component';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'oitc-trafficlight-widget',
    imports: [
        FormLabelDirective,
        SelectOptgroupComponent,
        FaIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        ReactiveFormsModule,
        TrueFalseDirective,
        FormsModule,
        TrafficlightSvgComponent,
        NgClass
    ],
    templateUrl: './trafficlight-widget.component.html',
    styleUrl: './trafficlight-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrafficlightWidgetComponent extends BaseWidgetComponent implements AfterViewInit {
    protected flipped = signal<boolean>(false);
    @ViewChild('boxContainer') boxContainer?: ElementRef;
    public widgetHeight: number = 0;

    public isLink: boolean = false;

    public host_id: null | number = null;
    public service_id: null | number = null;
    public isEvcService: boolean = false;
    public showLabel: boolean = false;

    public currentState: number | undefined = undefined;
    public label: string = '';

    public services: SelectItemOptionGroup[] = [];

    private readonly TrafficlightWidgetService = inject(TrafficlightWidgetService);
    private readonly ServicesService = inject(ServicesService);

    private router: Router = inject(Router);

    public override load() {
        if (this.widget) {
            this.service_id = null;
            this.TrafficlightWidgetService.loadWidgetConfig(this.widget.id).subscribe((response) => {
                // is a service selected?
                if (!Array.isArray(response.service.Service) && !Array.isArray(response.service.Servicestatus)) {
                    this.service_id = response.service.Service.id;
                    this.host_id = response.service.Service.host_id;
                    this.isEvcService = response.service.Service.isEVCService;
                    this.label = `${response.service.Service.hostname}/${response.service.Service.servicename}`
                    this.currentState = response.service.Servicestatus.currentState;
                }

                this.showLabel = response.config.show_label;

                this.checkUserPermissions();

                this.cdr.markForCheck();
            });
        }
    }

    public ngAfterViewInit(): void {
        this.calcTrafficlightSvgHeight();
    }

    public override onAnimationStart(event: AnimationEvent) {
        if (event.toState && this.services.length === 0) {
            // "true" means show config.
            // Load initial Services
            this.loadServicesByString('');
        }

        super.onAnimationStart(event);
    }

    private calcTrafficlightSvgHeight() {
        this.widgetHeight = this.boxContainer?.nativeElement.offsetHeight;

        let height = this.widgetHeight - 29 - 12; //Unit: px
        //                                        ^ Show / Hide Config button
        //                                            ^ Some Padding

        if (height < 15) {
            height = 15;
        }

        this.widgetHeight = height;
        this.cdr.markForCheck();
    }

    public saveConfig() {
        if (this.service_id && this.widget) {
            this.TrafficlightWidgetService.saveWidgetConfig(this.widget.id, this.service_id, this.showLabel).subscribe((response) => {
                // Update the markdown content
                this.load();

                // Close config
                this.flipped.set(false);
            });
        }
    }

    public loadServicesByString = (searchString: string) => {
        const params: ServicesLoadServicesByStringParams = {
            angular: true,
            'filter[servicename]': searchString,
            'selected[]': [],
            includeDisabled: false
        };

        if (this.service_id) {
            params['selected[]'].push(this.service_id);
        }

        this.subscriptions.add(this.ServicesService.loadServicesByString(params)
            .subscribe((result) => {
                this.services = result;

                this.cdr.markForCheck();
            })
        );
    };

    public override ngOnDestroy() {
        super.ngOnDestroy();
    }

    public override resizeWidget(event?: KtdResizeEnd) {
        this.calcTrafficlightSvgHeight();
    }

    public override layoutUpdate(event: KtdGridLayout) {

    }

    public naviagteToBrowser() {
        if (this.service_id) {
            if (this.isEvcService) {
                this.subscriptions.add(this.PermissionsService.hasPermissionObservable(['EventcorrelationModule', 'eventcorrelations', 'view']).subscribe((hasPermission) => {
                    if (hasPermission) {
                        this.router.navigate(['/eventcorrelation_module/eventcorrelations/view', this.host_id]);

                        return;
                    }

                    this.subscriptions.add(this.PermissionsService.hasPermissionObservable(['Services', 'browser']).subscribe((hasPermission) => {
                        if (hasPermission) {
                            this.router.navigate(['/services/browser', this.service_id]);
                        }
                    }));
                }));
            } else {
                // Default service
                this.subscriptions.add(this.PermissionsService.hasPermissionObservable(['Services', 'browser']).subscribe((hasPermission) => {
                    if (hasPermission) {
                        this.router.navigate(['/services/browser', this.service_id]);
                    }
                }));
            }
        }
    }

    private checkUserPermissions() {
        forkJoin([
            this.PermissionsService.hasPermissionObservable(['Services', 'browser']),
            this.PermissionsService.hasPermissionObservable(['EventcorrelationModule', 'eventcorrelations', 'view'])
        ]).subscribe(result => {
            this.isLink = result[0] || result[1];
            this.cdr.markForCheck();
        })

    }
}
