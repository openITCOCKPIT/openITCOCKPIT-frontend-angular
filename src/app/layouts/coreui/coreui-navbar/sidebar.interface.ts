export interface SidebarAction {
    unfoldable?: boolean | 'toggle';
    visible?: boolean | 'toggle';
    toggle?: 'visible' | 'unfoldable';
    narrow?: boolean;
    mobile?: boolean;
    //sidebar?: SidebarComponent;
    id?: string;
}
