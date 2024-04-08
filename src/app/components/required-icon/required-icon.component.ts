import { Component } from '@angular/core';
import {faAsterisk} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'oitc-required-icon',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './required-icon.component.html',
  styleUrl: './required-icon.component.css'
})
export class RequiredIconComponent {

  protected readonly faAsterisk = faAsterisk;
}
