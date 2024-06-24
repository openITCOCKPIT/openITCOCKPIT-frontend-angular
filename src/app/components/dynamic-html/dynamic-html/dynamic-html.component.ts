import {
    AfterViewInit,
    Component,
    ElementRef,
    EnvironmentInjector,
    Injector, OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
    selector: 'oitc-dynamic-html',
    standalone: true,
    imports: [],
    styleUrl: './dynamic-html.component.css',
    template: '<div #container></div>',
})
export class DynamicHtmlComponent implements OnInit {
    //templateHtml$: Observable<string> = of('load supported-features.html here').pipe(delay(1000));
    @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;


    constructor(
        private injector: Injector,
        private environement: EnvironmentInjector
    ) {}

    ngOnInit(): void {
        console.log('HELLO HERE !!!');
        console.log('HELLO HERE !!!');
        this.container.element.nativeElement.innerHTML = 'SERVICE NOTIFICATION SUPPRESSED: <a *oitcPermission="[\'hosts\', \'index\']" [routerLink]="[\'/\', \'hosts\', \'index\', \'id\', 61]"><b>localhost</b></a>;<a *oitcPermission="[\'services\', \'index\']" [routerLink]="[\'/\', \'services\', \'index\', \'id\', 1566]"><b>load_prometheus</b></a>;No notification sent, because no contacts were found for notification purposes.';
        // Technique #1
        /*
        this.templateHtml$.subscribe((html) => {
             this.container.element.nativeElement.innerHTML = html;
         });

         */
    }

}
