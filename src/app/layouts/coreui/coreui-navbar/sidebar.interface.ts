export interface SidebarActionOrig {
    unfoldable?: boolean | 'toggle';
    visible?: boolean | 'toggle';
    toggle?: 'visible' | 'unfoldable';
    narrow?: boolean;
    mobile?: boolean;
    //sidebar?: SidebarComponent;
    id?: string;
}

export interface SidebarAction {
    id: string,
    visible: boolean,
}

export interface SidebarGroupAction {
    open: boolean,
    id: string,
}
