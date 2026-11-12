import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CardBodyComponent, CardComponent, CardHeaderComponent, CardTitleDirective } from '@coreui/angular';
import { CvesHostDetailsComponent } from '../../../components/cves-host-details/cves-host-details.component';
import { CvesPagesNavComponent } from '../../../components/cves-pages-nav/cves-pages-nav.component';

@Component({
    selector: 'oitc-cves-host',
    imports: [
        RouterLink,
        TranslocoDirective,
        FaIconComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        CvesHostDetailsComponent,
        CvesPagesNavComponent
    ],
    templateUrl: './cves-host.component.html',
    styleUrl: './cves-host.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvesHostComponent {
    private readonly route = inject(ActivatedRoute);

    public readonly hostId: number = Number(this.route.snapshot.paramMap.get('id'));
}
