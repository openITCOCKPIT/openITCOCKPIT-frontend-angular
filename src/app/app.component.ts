import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FontAwesomeModule, FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'oitc-root',
    standalone: true,
    imports: [
        RouterOutlet,
        FontAwesomeModule
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    constructor(library: FaIconLibrary) {
        // Add an icon to the library for convenient access in other components
        library.addIconPacks(fas);
    }
}
