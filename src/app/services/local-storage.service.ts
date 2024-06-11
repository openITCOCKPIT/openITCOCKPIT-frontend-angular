import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    constructor() {
    }

    // Check if a key exists in local storage
    hasItem(key: string, value: string): boolean {
        return localStorage.getItem(key) !== null;
    }

    // Set a value in local storage
    setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    // Get a value from local storage
    getItem(key: string): string | null {
        return localStorage.getItem(key);
    }

    // Get a value from local storage with a default value
    getItemWithDefault(key: string, defaultValue: any): string | any {
        const val = this.getItem(key);
        if (val === null) {
            return defaultValue;
        }

        return val;
    }

    // Remove a value from local storage
    removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    // Clear all items from local storage
    clear(): void {
        localStorage.clear();
    }
}
