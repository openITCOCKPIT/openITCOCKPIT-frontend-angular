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
            case 0:  //OK
                this.iconColor = 'text-success';
                break;
            case 1:  //WARNING
                this.iconColor = 'text-warning';
                break;
            case 2:  //CRITICAL
                this.iconColor = 'text-danger';
                break;
            case 3:  //UNKNOWN
                this.iconColor = 'text-muted';
                break;
            default: //NOT IN MONITORING
                this.iconColor = 'text-primary';
                break;
        }
    }
}
