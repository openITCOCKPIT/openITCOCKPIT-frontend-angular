import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ChangelogIndex } from '../changelogs.interface';
import { JsonPipe, KeyValuePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'oitc-changelogs-entry',
    standalone: true,
    imports: [
        NgIf,
        NgClass,
        KeyValuePipe,
        PermissionDirective,
        TranslocoDirective,
        JsonPipe,
        FaIconComponent,
        NgForOf
    ],
    templateUrl: './changelogs-entry.component.html',
    styleUrl: './changelogs-entry.component.css',
    encapsulation: ViewEncapsulation.None, //https://angular.io/guide/view-encapsulation
})
export class ChangelogsEntryComponent implements OnInit {

    @Input() changelogentry?: ChangelogIndex;
    //public data?:DataUnserialized = undefined;
    public data: any[] = [];


    public checkIfIsArray(value: any): boolean {
        if (typeof value === 'object') {
            if (value.hasOwnProperty('isArray')) {
                return value['isArray'];
            }
        }
        return false;
    }

    public ngOnInit(): void {
        if (this.changelogentry) {
            if (typeof this.changelogentry.data_unserialized === 'object') {
                //this.data = this.changelogentry.data_unserialized;
                this.data = Object.entries(this.changelogentry.data_unserialized);
                //console.log(Object.entries(this.changelogentry.data_unserialized))
            }
            //console.log(this.changelogentry.data_unserialized);
        }

    }

}
