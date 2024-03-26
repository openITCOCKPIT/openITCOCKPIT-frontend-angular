import {Component, Input} from '@angular/core';
import {NgFor} from "@angular/common";
import {ListItemComponent} from "../list-item/list-item.component";

@Component({
  selector: 'oitc-list',
  standalone: true,
  imports: [NgFor, ListItemComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
}
