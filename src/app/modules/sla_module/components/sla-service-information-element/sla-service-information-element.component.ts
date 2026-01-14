import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges
} from '@angular/core';
import { Subscription } from 'rxjs';

import { AsyncPipe, DecimalPipe, KeyValuePipe, NgClass } from '@angular/common';

import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { SkeletonModule } from 'primeng/skeleton';
import { SlaServiceInformationElementService } from './sla-service-information-element.service';
import { PermissionsService } from '../../../../permissions/permissions.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Response, SlaServiceInformationElementRoot } from './sla-service-information-element.interface';
import {
  AlertComponent,
  BadgeComponent,
  ColComponent,
  RowComponent,
  TableDirective
} from '@coreui/angular';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';




import { FormsModule } from '@angular/forms';
import { Sla } from '../../pages/slas/slas.interface';
import { WeekDays } from '../timeperiod-details-tooltip/timeperiod-details-tooltip.interface';

import { BadgeOutlineComponent } from '../../../../layouts/coreui/badge-outline/badge-outline.component';
import { TableLoaderComponent } from '../../../../layouts/primeng/loading/table-loader/table-loader.component';

@Component({
    selector: 'oitc-sla-service-information-element',
    imports: [
    TranslocoDirective,
    SkeletonModule,
    ColComponent,
    FaIconComponent,
    RowComponent,
    RouterLink,
    FormsModule,
    AsyncPipe,
    NgClass,
    TableDirective,
    BadgeOutlineComponent,
    KeyValuePipe,
    BadgeComponent,
    AlertComponent,
    TableLoaderComponent,
    DecimalPipe
],
    templateUrl: './sla-service-information-element.component.html',
    styleUrl: './sla-service-information-element.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlaServiceInformationElementComponent implements OnDestroy, OnChanges {

    @Input() public serviceId: number = 0;

    private subscriptions: Subscription = new Subscription();
    public readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly TranslocoService = inject(TranslocoService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly SlaServiceInformationElementService = inject(SlaServiceInformationElementService);
    private cdr = inject(ChangeDetectorRef);

    public sla_information: Response | null = {} as Response;
    public sla: Sla = {} as Sla;
    public weekDays: WeekDays = {} as WeekDays;

    public isLoading: boolean = true;

    protected weekdayNames: { id: number, name: string }[] = [
        {id: 1, name: this.TranslocoService.translate('Monday')},
        {id: 2, name: this.TranslocoService.translate('Tuesday')},
        {id: 3, name: this.TranslocoService.translate('Wednesday')},
        {id: 4, name: this.TranslocoService.translate('Thursday')},
        {id: 5, name: this.TranslocoService.translate('Friday')},
        {id: 6, name: this.TranslocoService.translate('Saturday')},
        {id: 7, name: this.TranslocoService.translate('Sunday')}
    ];

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public load() {

        this.isLoading = true;
        this.sla_information = null;

        if (this.serviceId > 0) {

            this.subscriptions.add(this.SlaServiceInformationElementService.loadSlaServiceInformation(this.serviceId)
                .subscribe((result: SlaServiceInformationElementRoot) => {
                    this.isLoading = false;
                    this.sla_information = result.response;
                    this.sla = result.sla;

                    this.weekDays = [];
                    for (let i = 0; i <= 6; i++) {
                        // Array required to keep order
                        this.weekDays[i] = [];
                    }


                    if (this.sla.timeperiod.timeperiod_timeranges) {
                        for (let key in this.sla.timeperiod.timeperiod_timeranges) {
                            let timerange = this.sla.timeperiod.timeperiod_timeranges[key];
                            // Server day 1 - 7
                            // JavaScript days 0 - 6 to get an array (array has to start with 0!) :(
                            let day = timerange.day - 1;
                            this.weekDays[day].push({
                                start: timerange.start,
                                end: timerange.end
                            });
                        }
                    }
                    this.cdr.markForCheck();
                }));
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.load();
        this.cdr.markForCheck();
    }

}
