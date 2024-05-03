import { booleanAttribute, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MenuLink } from '../../../../components/navigation/navigation.interface';
import { filter } from 'rxjs/operators';
import { NavbarGroupService } from './navbar-group.service';
import { NgClass } from '@angular/common';


@Component({
    selector: 'oitc-navbar-group',
    standalone: true,
    imports: [
        FaIconComponent,
        RouterLink,
        NgClass
    ],
    templateUrl: './navbar-group.component.html',
    styleUrl: './navbar-group.component.css'
})
export class NavbarGroupComponent implements OnInit {
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

    @Input({required: true}) item!: MenuLink;
    @Input() show?: boolean;
    @Input({transform: booleanAttribute}) compact?: boolean;


    public navigationEndObservable: Observable<NavigationEnd>;
    public open: boolean = false;

    private subscriptions: Subscription = new Subscription();

    public ngOnInit(): void {
        this.subscriptions.add(this.navbarGroupService.sidebarNavGroupState$.subscribe(next => {
            if (next.id !== String(this.item.alias) && next.open) {
                // Some other group got opened in the main menu, so we close our menu (if we are open)
                if (this.open) {
                    this.openOrClose();
                }
            }
        }));
    }

    public openOrClose() {
        this.open = !this.open;

        // Tell the world - that we are now open (or closed)
        this.navbarGroupService.toggle({
            open: this.open,
            id: String(this.item.alias)
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
