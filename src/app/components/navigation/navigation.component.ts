import {Component, inject} from '@angular/core';
import {RouterLink} from "@angular/router";
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NavigationService} from "./navigation.service";
import {Link} from "./navigation.interface";
import {FormsModule} from "@angular/forms";
import {AsyncPipe, JsonPipe, NgFor, NgIf} from "@angular/common";
import {BehaviorSubject} from "rxjs";

@Component({
    selector: 'oitc-navigation',
    standalone: true,
    imports: [RouterLink, FontAwesomeModule, FormsModule, AsyncPipe, JsonPipe, NgIf, NgFor],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.css'
})
export class NavigationComponent {
    private readonly NavigationService: NavigationService = inject(NavigationService);

    public MenuSubject: BehaviorSubject<Link[]>;

    constructor() {
        this.MenuSubject = this.NavigationService.getLinkSubject();
    };

    public toggleGroup(item:object ) : void
    {
        console.warn("Congrats, you toggled a group. Dipshit!");
        console.warn(item);
    }

}
