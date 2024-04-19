import { Component, inject } from '@angular/core';
import { IconComponent } from "@coreui/icons-angular";
import { DomSanitizer } from '@angular/platform-browser';


@Component({
    selector: 'oitc-coreui-menu',
    standalone: true,
    imports: [],
    templateUrl: './coreui-menu-icon.component.html',
    styleUrls: ['./coreui-menu-icon.component.css']
})
export class CoreuiMenuIconComponent extends IconComponent {
    override get innerHtml(): string {
        let a: DomSanitizer = inject(DomSanitizer);
        return 'FAKE123';
    }
}
