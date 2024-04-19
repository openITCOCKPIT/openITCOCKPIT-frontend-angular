import { Directive, HostListener, Input } from '@angular/core';
import { HistoryService } from '../history.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Directive({
    selector: '[oitcBackButton]',
    standalone: true
})
export class BackButtonDirective {

    @Input() fallbackUrl: string[] = [];

    constructor(private historyService: HistoryService, private location: Location, private router: Router) {
    }

    @HostListener('click')
    onClick(): void {
        const previousUrl = this.historyService.getPreviousUrl();
        console.log(previousUrl);
        if (previousUrl) {
            if (previousUrl != '/') {
                this.location.back();
                return;
            }
        }

        // Use fallback state
        this.router.navigate(this.fallbackUrl);
    }

}
