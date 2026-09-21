import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    Input
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'oitc-server-link',
    imports: [],
    templateUrl: './server-link.component.html',
    styleUrl: './server-link.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerLinkComponent implements AfterViewInit {

    @Input() public linkHtml: string = '';

    constructor(private ref: ElementRef<HTMLElement>, private router: Router) {
    }

    private cdr = inject(ChangeDetectorRef);


    public ngAfterViewInit(): void {
        // This is a workaround to make the routerLink directive work in dynamic HTML
        // The server response a string which contains a link <a rel="ng" href="/hosts/index/id/61">localhost</a>
        // and this code searches for all a elements with rel="ng" and adds a click event to navigate to the href
        // @ts-ignore
        // https://stackoverflow.com/a/76615277/11885414
       /* this.ref.nativeElement.querySelectorAll<HTMLAnchorElement>('a[rel="ng"]').forEach((link: any) => {
            link.addEventListener('click', (evt: any) => {
                console.log(link.attributes.getNamedItem('href')?.value);
                evt.preventDefault();
                void this.router.navigateByUrl(link.attributes.getNamedItem('href')?.value);
            });
        }); */

        this.ref.nativeElement.querySelectorAll<HTMLAnchorElement>('a[rel="ng"]').forEach((link: HTMLAnchorElement) => {
            const appPath = link.getAttribute('href'); // e.g. "/services/index?id=106"
            if (!appPath) {
                return;
            }

            // Make the href relative so native browser navigation
            // (new tab, middle-click, ctrl+click, right-click menu)
            // resolves it against <base href="/a/"> correctly.
            link.setAttribute('href', appPath.replace(/^\//, ''));

            link.addEventListener('click', (evt: MouseEvent) => {
                // Let modifier-clicks and middle-click fall through to native
                // browser handling — the corrected relative href + <base> now
                // resolves correctly on its own.
                if (evt.ctrlKey || evt.metaKey || evt.shiftKey || evt.button === 1) {
                    return;
                }

                evt.preventDefault();
                void this.router.navigateByUrl(appPath); // original absolute-in-app path for the router
            });
        });

    }
}
