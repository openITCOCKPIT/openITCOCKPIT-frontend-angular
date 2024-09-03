import { Component, Input, OnInit } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
    selector: 'oitc-custom-class-information',
    standalone: true,
    imports: [
        NgIf,
        NgForOf,
        NgClass
    ],
    templateUrl: './custom-class-information.component.html',
    styleUrl: './custom-class-information.component.css'
})
export class CustomClassInformationComponent implements OnInit {
    @Input() customInfo!: any;

    ngOnInit(): void {
    }

    isPrintable(data: any): boolean {
        return !this.isArray(data) && !this.isObject(data);
    }

    isObject(data: any): boolean {
        return data && typeof data === 'object' && !Array.isArray(data);
    }

    isArray(data: any): boolean {
        return Array.isArray(data);
    }

    objectEntries(obj: any): { key: string, value: any }[] {
        return Object.entries(obj).map(([key, value]) => ({key, value}));
    }

}
