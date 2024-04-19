import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "../../components/header/header.component";

@Component({
    selector: 'oitc-smartadmin',
    standalone: true,
    imports: [
        RouterOutlet,
        HeaderComponent
    ],
    templateUrl: './smartadmin.component.html',
    styleUrl: './smartadmin.component.css'
})
export class SmartadminComponent {

}
