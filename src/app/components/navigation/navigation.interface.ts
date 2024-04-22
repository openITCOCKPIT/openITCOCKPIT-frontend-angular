export interface Link {
    name: string;
    state: string;
    controller: string;
    action: string;
    plugin: string;
    alias: any,
    tags: string[];
    order: bigint;
    icon: string;
    items: Link[] | null;
    showSubmenu: boolean | undefined;
}

export interface NavigationInterface {
    menu: Link[]
}
