import {Component, inject, Injectable} from '@angular/core';
import {IconComponent} from "@coreui/icons-angular";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';



@Component({
  selector: 'oitc-coreui-menu',
  standalone: true,
  imports: [],
  templateUrl: './coreui-menu-icon.component.html',
  styleUrls: ['./coreui-menu-icon.component.css']
})
export class CoreuiMenuIconComponent extends IconComponent {
  override get innerHtml(): string {
    let a : DomSanitizer = inject(DomSanitizer);
    return 'FAKE123';
  }
}
