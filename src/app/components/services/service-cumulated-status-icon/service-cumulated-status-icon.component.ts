import { Component, Input, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'oitc-service-cumulated-status-icon',
    standalone: true,
    imports: [
        FaIconComponent
    ],
    templateUrl: './service-cumulated-status-icon.component.html',
    styleUrl: './service-cumulated-status-icon.component.css'
})
export class ServiceCumulatedStatusIconComponent implements OnInit {
    protected iconColor: string = 'text-muted';

    @Input() public cumulatedState: number = -1;

    public ngOnInit(): void {
        switch (this.cumulatedState) {
            case 0:
                this.iconColor = 'text-success';
                break;
            case 1:
                this.iconColor = 'text-warning';
                break;
            case 2:
                this.iconColor = 'text-danger';
                break;
            case 3:
            default:
                this.iconColor = 'text-muted';
                break;
        }
    }
}
