/* This file is for generic interfaces that can be used in the application
 * Before creating a new interface, check if it can be used in multiple places and if it is a generic interface
 * to keep this file small and clean
 */

export interface GenericIdAndName {
    id: number;
    name: string;
}

export interface GenericKeyValue {
    key: any,
    value: any
}
