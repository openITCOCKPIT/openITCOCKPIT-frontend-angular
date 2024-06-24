import { Component, AfterViewInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PermissionDirective } from '../../../permissions/permission.directive';

@Component({
    selector: 'dynamic-component',
    template: `SERVICE ALERT: <a *oitcPermission="['hosts', 'index']"
                                 [routerLink]="['/', 'hosts', 'index', 'id', 61]"><b>localhost</b></a>;<a
        *oitcPermission="['services', 'index']"
        [routerLink]="['/', 'services', 'index', 'id', 1566]"><b>load_prometheus</b></a>;WARNING;HARD;1;Warning: 1 item/s are warning. Warning values: [1.03]. 1 items are pending.`,
    imports: [
        RouterLink,
        PermissionDirective
    ],
    standalone: true
})
export class DynamicComponent {}

@Component({
    selector: 'oitc-dynamic-html',
    standalone: true,
    imports: [],
    styleUrl: './dynamic-html.component.css',
    template: '<div #content></div>',
})
export class DynamicHtmlComponent implements AfterViewInit {
    @ViewChild('content', { read: ViewContainerRef }) content!: ViewContainerRef;

    constructor(private ViewContainerRef: ViewContainerRef) {}

    ngAfterViewInit() {
        this.ViewContainerRef.createComponent(DynamicComponent);
    }
}
