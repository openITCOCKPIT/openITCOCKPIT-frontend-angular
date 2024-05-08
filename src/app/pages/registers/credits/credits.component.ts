import { Component, ElementRef, HostListener, inject, OnDestroy, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
    selector: 'oitc-credits',
    standalone: true,
    imports: [
        FaIconComponent,
        XsButtonDirective,
        TranslocoDirective
    ],
    templateUrl: './credits.component.html',
    styleUrl: './credits.component.css'
})
export class CreditsComponent implements OnDestroy {

    public hideCredits: boolean = true;
    public isFullScreen: boolean = false;
    public scrollInterval: Subscription | null = null;

    private readonly document = inject(DOCUMENT);

    @ViewChild('fullScreenCredits', {read: ElementRef}) divRef!: ElementRef;

    openFullscreen() {
        // Use this.divRef.nativeElement here to request fullscreen
        const elem = this.divRef.nativeElement;

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        }
    }

    @HostListener("document:fullscreenchange", ['$event']) fullScreen() {
        if (this.isFullScreen) {
            // Leave full screen
            if (this.scrollInterval) {
                this.scrollInterval.unsubscribe();
            }
            this.hideCredits = true;
            this.isFullScreen = false;
        } else {
            // go from window mode to full screen mode
            this.hideCredits = false;
            this.isFullScreen = true;

            setTimeout(() => {
                this.scrollCredits();
            }, 10);
        }
    }

    public scrollCredits() {
        let creditsContainerElm = this.document.getElementById('credits-container');
        if (creditsContainerElm) {
            creditsContainerElm.style.width = window.innerWidth + 'px';
            creditsContainerElm.style.height = window.innerHeight + 'px';
        }

        let creditsElm = this.document.getElementById('credits');
        if (creditsElm) {

            //Move credits to the bottom out of the monitor
            let bottom = creditsElm.offsetHeight + 10;
            bottom = bottom * -1;
            creditsElm.style.bottom = bottom + 'px';

            let stopPosition = (window.innerHeight / 2) - (250 / 2); //114 is height of oITC logo in px
            let stopInterval = (window.innerHeight / 2) + 100;
            let marginTop = 1;

            this.scrollInterval = interval(10).subscribe(() => {
                bottom++;
                if (bottom > stopPosition) {
                    marginTop++;
                    let logoElm = this.document.getElementById('credits-oitc-logo');
                    if (logoElm) {
                        logoElm.style.marginTop = marginTop + 'px';
                    }
                } else {
                    creditsElm.style.bottom = bottom + 'px';
                }

                if (marginTop > stopInterval) {
                    if (this.scrollInterval) {
                        this.scrollInterval.unsubscribe();
                    }
                }
            });
        }
    }

    public ngOnDestroy() {
        if (this.scrollInterval) {
            this.scrollInterval.unsubscribe();
        }
        this.hideCredits = true;
        this.isFullScreen = false;
    }
}
