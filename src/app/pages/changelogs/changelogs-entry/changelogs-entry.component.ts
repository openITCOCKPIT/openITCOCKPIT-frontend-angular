import { Component, Input } from '@angular/core';
import { ChangelogIndex } from '../changelogs.interface';
import { KeyValuePipe, NgClass, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'oitc-changelogs-entry',
  standalone: true,
    imports: [
        NgIf,
        NgClass,
        KeyValuePipe,
        PermissionDirective,
        TranslocoDirective
    ],
  templateUrl: './changelogs-entry.component.html',
  styleUrl: './changelogs-entry.component.css'
})
export class ChangelogsEntryComponent {

@Input() changelogentry?: ChangelogIndex;
}
