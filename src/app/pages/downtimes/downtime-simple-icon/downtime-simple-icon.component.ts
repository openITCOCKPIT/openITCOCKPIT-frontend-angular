import { Component, inject, Input } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Downtime } from '../downtimes.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';


@Component({
    selector: 'oitc-downtime-simple-icon',
    standalone: true,
    imports: [
        FaIconComponent,
        TranslocoDirective,
        NgIf
    ],
    templateUrl: './downtime-simple-icon.component.html',
    styleUrl: './downtime-simple-icon.component.css'
})
export class DowntimeSimpleIconComponent {
    private readonly TranslocoService = inject(TranslocoService);
    public iconColor: string = 'btn-primary';
    public downtimeStateTitle: string = '';
    @Input() downtime!: Downtime;

}
