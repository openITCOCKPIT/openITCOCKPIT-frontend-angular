import {Component, inject} from '@angular/core';
import {RouterLink} from "@angular/router";
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NavigationService} from "./navigation.service";
import {Link} from "./navigation.interface";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'oitc-navigation',
    standalone: true,
    imports: [RouterLink, FontAwesomeModule, FormsModule],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.css'
})
export class NavigationComponent {
    private readonly NavigationService: NavigationService = inject(NavigationService);

    public menu: Link[];

    constructor() {
        this.menu = this.NavigationService.getMenu();
    };

}
