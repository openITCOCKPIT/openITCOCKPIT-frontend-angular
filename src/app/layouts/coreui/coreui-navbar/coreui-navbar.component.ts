import { booleanAttribute, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from './sidebar.service';
import { NavigationService } from '../../../components/navigation/navigation.service';
import { Subscription } from 'rxjs';
import { MenuHeadline, NavigationInterface } from '../../../components/navigation/navigation.interface';
import { JsonPipe, NgClass, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NavbarGroupComponent } from './navbar-group/navbar-group.component';
import { SidebarAction } from './sidebar.interface';
import { NgScrollbar } from 'ngx-scrollbar';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
    selector: 'oitc-coreui-navbar',
    standalone: true,
    imports: [
        RouterLink,
        JsonPipe,
        FaIconComponent,
        NavbarGroupComponent,
        NgClass,
        NgScrollbar,
        NgIf
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
        private navigationService: NavigationService,
        private breakpointObserver: BreakpointObserver,
    ) {
    }

    //@Input() navItems?: INavData[] = [];
    @Input() dropdownMode: 'path' | 'none' | 'close' = 'path';
    @Input({transform: booleanAttribute}) groupItems?: boolean;
    @Input({transform: booleanAttribute}) compact?: boolean;

    public visible: boolean = true; // show or hide the complete menu
    public unfoldable: boolean = false; // compact menu
    public isUnfoldable: boolean = true; // disabled on mobile devices


    private subscriptions: Subscription = new Subscription()

    public menu: MenuHeadline[] = [];

    public ngOnInit() {
        this.subscriptions.add(this.navigationService.loadMenu()
            .subscribe((result: NavigationInterface) => {
                // Menu records are loaded
                this.menu = result.menu;
            })
        );

        this.subscriptions.add(this.sidebarService.sidebarState$.subscribe((next: SidebarAction) => {
            // Subscribe which send shor or hide of the complete sidebar navigation
            this.visible = next.visible;
        }));

        // Detect if browser changes to mobile size
        const mobileBreakpoint = '767.98px';
        const onMobile = `(max-width: ${mobileBreakpoint})`;
        const layoutChanges = this.breakpointObserver.observe([onMobile]);
        this.subscriptions.add(layoutChanges.subscribe((result: BreakpointState) => {
            const isCurrentlyMobile: boolean = result.breakpoints[onMobile];

            if (isCurrentlyMobile) {
                // Mobile device screen
                this.unfoldable = false;
                this.isUnfoldable = false; // Not allowed on mobile devices
            } else {
                // Desktop
                this.isUnfoldable = true;
            }

        }));

    }

    public toggleUnfoldable() {
        this.unfoldable = !this.unfoldable;
    }

    public hideMenu() {
        this.sidebarService.toggleShowOrHideSidebar();
    }

    /*
    get getMobileBreakpoint(): string {
        const element: Element = this.document.documentElement;
        const mobileBreakpoint = this.document.defaultView?.getComputedStyle(element)?.getPropertyValue('--cui-mobile-breakpoint') ?? 'md';
        const breakpointValue = this.document.defaultView?.getComputedStyle(element)?.getPropertyValue(`--cui-breakpoint-${mobileBreakpoint.trim()}`) ?? '768px';
        return `${parseFloat(breakpointValue.trim()) - 0.02}px` || '767.98px';
    }*/

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
