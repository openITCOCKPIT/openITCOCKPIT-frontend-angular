import { booleanAttribute, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from './sidebar.service';
import { NavigationService } from '../../../components/navigation/navigation.service';
import { Subscription } from 'rxjs';
import { MenuHeadline, NavigationInterface } from '../../../components/navigation/navigation.interface';
import { JsonPipe, NgClass } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NavbarGroupComponent } from './navbar-group/navbar-group.component';
import { SidebarAction } from './sidebar.interface';
import { NgScrollbar } from 'ngx-scrollbar';

@Component({
    selector: 'oitc-coreui-navbar',
    standalone: true,
    imports: [
        RouterLink,
        JsonPipe,
        FaIconComponent,
        NavbarGroupComponent,
        NgClass,
        NgScrollbar
    ],
    templateUrl: './coreui-navbar.component.html',
    styleUrl: './coreui-navbar.component.css'
})
export class CoreuiNavbarComponent implements OnInit {
    constructor(
        //@Optional() public sidebar: SidebarComponent,
        //public helper: SidebarNavHelper,
        public router: Router,
        private renderer: Renderer2,
        private hostElement: ElementRef,
        private sidebarService: SidebarService,
        private navigationService: NavigationService
    ) {
    }

    //@Input() navItems?: INavData[] = [];
    @Input() dropdownMode: 'path' | 'none' | 'close' = 'path';
    @Input({transform: booleanAttribute}) groupItems?: boolean;
    @Input({transform: booleanAttribute}) compact?: boolean;

    public visible: boolean = true; // show or hide the complete menu


    private subscriptions: Subscription = new Subscription()

    public menu: MenuHeadline[] = [];

    public ngOnInit() {
        this.subscriptions.add(this.navigationService.loadMenu()
            .subscribe((result: NavigationInterface) => {
                this.menu = result.menu;
            })
        );

        this.subscriptions.add(this.sidebarService.sidebarState$.subscribe((next: SidebarAction) => {
            this.visible = next.visible;
        }));
    }

    //public ngOnChanges(changes: SimpleChanges): void {
    //    this.navItemsArray = Array.isArray(this.navItems) ? this.navItems.slice() : [];
    //}

// public hideMobile(): void {
//     // todo: proper scrollIntoView() after NavigationEnd
//     if (this.sidebar && this.sidebar.sidebarState.mobile) {
//         this.sidebarService.toggle({toggle: 'visible', sidebar: this.sidebar});
//     }
// }

}
