import {
    booleanAttribute,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    input,
    Input,
    OnDestroy,
    OnInit,
    Renderer2
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MenuLink } from '../../../../components/navigation/navigation.interface';
import { filter } from 'rxjs/operators';
import { NavbarGroupService } from './navbar-group.service';
import { NgClass } from '@angular/common';


@Component({
    selector: 'oitc-navbar-group',
    imports: [
        FaIconComponent,
        RouterLink,
        NgClass
    ],
    templateUrl: './navbar-group.component.html',
    styleUrl: './navbar-group.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarGroupComponent implements OnInit, OnDestroy {
    constructor(
        private router: Router,
        private renderer: Renderer2,
        private hostElement: ElementRef,
        private navbarGroupService: NavbarGroupService
    ) {
        this.navigationEndObservable = router.events.pipe(
            filter((event: any) => event instanceof NavigationEnd)
        ) as Observable<NavigationEnd>;
    }

    @Input() show?: boolean;
    @Input({transform: booleanAttribute}) compact?: boolean;

    public item = input.required<MenuLink>();

    public navigationEndObservable: Observable<NavigationEnd>;
    public open: boolean = false;

    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.subscriptions.add(this.navbarGroupService.sidebarNavGroupState$.subscribe(next => {
            const item = this.item();
            if (next.id !== String(item.alias) && next.open) {
                // Some other group got opened in the main menu, so we close our menu (if we are open)
                if (this.open) {
                    this.openOrClose();
                }
            }
        }));
    }

    public openOrClose() {
        this.open = !this.open;
        this.cdr.markForCheck();

        // Tell the world - that we are now open (or closed)
        const item = this.item();
        this.navbarGroupService.toggle({
            open: this.open,
            id: String(item.alias)
        });
    }


    public toggleGroup($event: any): void {
        $event.preventDefault();
        this.openOrClose();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

}
