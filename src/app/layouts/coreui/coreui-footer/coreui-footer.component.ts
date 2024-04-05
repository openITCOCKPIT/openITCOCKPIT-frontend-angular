import { Component } from '@angular/core';
import { FooterComponent } from '@coreui/angular';

@Component({
  selector: 'oitc-coreui-footer',
  standalone: true,
  imports: [],
  templateUrl: './coreui-footer.component.html',
  styleUrl: './coreui-footer.component.css'
})
export class CoreuiFooterComponent extends FooterComponent{
  constructor() {
    super();
  }
}
