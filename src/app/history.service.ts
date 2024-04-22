import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HistoryService implements OnDestroy {

    private previousUrls: string[] = [];
    private currentrUrl: string = '';

    private subscriptions: Subscription = new Subscription();

    constructor(private router: Router) {
        this.currentrUrl = this.router.url;

        const sub = router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.previousUrls.push(this.currentrUrl);
                this.currentrUrl = event.url;

                // Limit the length of previousUrls to 20
                while (this.previousUrls.length > 20) {
                    this.previousUrls.shift();
                }
            }
        });

        this.subscriptions.add(sub);
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public getPreviousUrls(): string[] {
        return this.previousUrls
    }

    public getPreviousUrl(): string | null {
        if (this.previousUrls.length > 0) {
            return this.previousUrls[this.previousUrls.length - 1];
        }

        return null;
    }

}
