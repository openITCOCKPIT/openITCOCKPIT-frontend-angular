import {
    Component,
    TemplateRef,
    inject,
    PipeTransform,
    Pipe,
    OnChanges,
    SimpleChanges,
    OnDestroy
} from '@angular/core';
import {Subscription} from 'rxjs';
import {ServicesbrowserService} from './servicesbrowser.service';
import {ServicesBrowser} from './services.interface';
import { TimezoneObject } from "./timezone.interface";
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {DatePipe, NgIf, NgForOf, JsonPipe} from '@angular/common';
import {ContainerComponent} from '@coreui/angular'
import {UplotGraphComponent} from '../../components/uplot-graph/uplot-graph.component';

@Component({
  selector: 'oitc-services-browser-page',
  standalone: true,
    imports: [
        NgIf,
        NgForOf,
        JsonPipe,
        ContainerComponent,
        UplotGraphComponent,

    ],
  templateUrl: './services-browser-page.component.html',
  styleUrl: './services-browser-page.component.css'
})
export class ServicesBrowserPageComponent implements OnDestroy {
    private subscriptions: Subscription = new Subscription();
    private ServicesBrowserService = inject(ServicesbrowserService);
    public service!: ServicesBrowser;
    public timezone!: TimezoneObject;
    public dataSources: { key: string, displayName: string }[] = [];

    constructor(private _liveAnnouncer: LiveAnnouncer) {
        this.load();
    }

    public load() {
        this.subscriptions.add(this.ServicesBrowserService.getServicesbrowser()
        .subscribe((service) => {
            this.service = service;
           // console.log(this.service.mergedService.Perfdata)
            this.getDataSources();
            this.getUserTimezone();
            })
        );
    }

    private getDataSources() {
        for(var dsKey in this.service.mergedService.Perfdata){
            var dsDisplayName = this.service.mergedService.Perfdata[dsKey].metric
            this.dataSources.push({
                key: dsKey, // load this datasource - this is important for Prometheus metrics which have no __name__ like rate() or sum(). We can than load metric 0, 1 or 2...
                displayName: dsDisplayName // Name of the metric to display in select
            });
        }
    }

    private getUserTimezone() {
        this.subscriptions.add(this.ServicesBrowserService.getUserTimezone()
            .subscribe((timezone) => {
                this.timezone = timezone.timezone;
                // console.log(this.service.mergedService.Perfdata)
            })
        );
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}
