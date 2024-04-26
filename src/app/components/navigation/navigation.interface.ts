import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface MenuHeadline {
    name: string,
    alias: string,
    order: number,
    items: MenuLink[]
}

export interface MenuLink {
    name: string,
    alias?: string,
    state: string, //AngularJS
    controller: string,
    action: string,
    plugin: string,
    icon: IconProp
    items: MenuLink[],
    tags: string[],
    order: number,
    isAngular: boolean,
    angularUrl: string | string[]
}

export interface NavigationInterface {
    menu: MenuHeadline[]
}
