import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'oitc-server-link',
    standalone: true,
    imports: [],
    templateUrl: './server-link.component.html',
    styleUrl: './server-link.component.css'
})
export class ServerLinkComponent implements AfterViewInit {

    @Input() public linkHtml: string = '';

    constructor(private router: Router, private ref: ElementRef) {
    }

    public ngAfterViewInit(): void {
        // This is a workaround to make the routerLink directive work in dynamic HTML
        // The server response a string which contains a link <a rel="ng" href="/hosts/index/id/61">localhost</a>
        // and this code searches for all a elements with rel="ng" and adds a click event to navigate to the href
        // @ts-ignore
        // https://stackoverflow.com/a/76615277/11885414
        this.ref.nativeElement.querySelectorAll<HTMLAnchorElement>('a[rel="ng"]').forEach((link: any) => {
            link.addEventListener('click', (evt: any) => {
                console.log(link.attributes.getNamedItem('href')?.value);
                evt.preventDefault();
                void this.router.navigateByUrl(link.attributes.getNamedItem('href')?.value);
            });
        });

    }
}
