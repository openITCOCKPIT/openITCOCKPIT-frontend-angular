import { Component, Input, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'oitc-additional-host-information',
    standalone: true,
    imports: [],
    templateUrl: './additional-host-information.component.html',
    styleUrl: './additional-host-information.component.css'
})
export class AdditionalHostInformationComponent {

    @Input() public hostId: number = 0;
    @Input() lastUpdated?: Date; // Change the date to trigger an update from an external component


    private subscriptions: Subscription = new Subscription();

    public ngOnInit(): void {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['hostId']) {
            this.load();
            return;
        }

        // Parent component wants to trigger an update
        if (changes['lastUpdated'] && !changes['lastUpdated'].isFirstChange()) {
            //this.load();
            return;
        }

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load(): void {
        console.log("Load additional host information");
    }


}
