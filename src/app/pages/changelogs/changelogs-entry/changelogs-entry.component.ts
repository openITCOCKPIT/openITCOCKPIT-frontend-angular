import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {
    ChangelogArrayFalseOldNew,
    ChangelogEntry,
    ChangelogEntryChange,
    ChangelogFieldValue,
    ChangelogIndex,
    DataUnserializedRaw
} from '../changelogs.interface';
import { NgClass } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'oitc-changelogs-entry',
    imports: [
    NgClass,
    PermissionDirective,
    TranslocoDirective,
    FaIconComponent,
    RouterLink
],
    templateUrl: './changelogs-entry.component.html',
    styleUrl: './changelogs-entry.component.css',
    encapsulation: ViewEncapsulation.None, //https://angular.io/guide/view-encapsulation
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangelogsEntryComponent implements OnInit {

    @Input() changelogentry?: ChangelogIndex;
    public entry: ChangelogEntry[] = [];
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        if (this.changelogentry) {
            if (typeof this.changelogentry.data_unserialized === 'object') {
                const dataRaw: DataUnserializedRaw = this.changelogentry.data_unserialized;

                for (const [controllerName, changeRaw] of Object.entries(dataRaw)) {
                    const changeForTemplate: ChangelogEntry = {
                        controllerName: controllerName,
                        changes: []
                    }

                    if (changeRaw.isArray) {
                        for (let i in changeRaw.data) {
                            const change = changeRaw.data[i];
                            //console.log(i, change);

                            const changelogEntryChange = this.parseApiResponseIntoTypescriptForArrayIsTrue(change);
                            changeForTemplate.changes.push(changelogEntryChange);
                        }
                    } else {
                        // The "isArray" key isset set to false in the API response
                        const changelogEntryChange = this.parseApiResponseIntoTypescriptForArrayIsFalse(changeRaw.data);
                        changeForTemplate.changes.push(changelogEntryChange);
                    }

                    this.entry.push(changeForTemplate);
                }
                this.cdr.markForCheck();
            }
        }
        //console.log(this.data);
    }


    private parseApiResponseIntoTypescriptForArrayIsTrue(change: any): ChangelogEntryChange {
        // Does this change has "new" and "old" keys?
        if (change.hasOwnProperty('new') && change.hasOwnProperty('old')) {
            // This should only be "edit" actions
            const cNew = change.new; //cNew = "changeNew" because "new" is registered word in TS
            const cOld = change.old;

            const hasNew = cNew !== null && cNew !== "";
            const hasOld = cOld !== null && cOld !== "";

            if (hasOld === false && hasNew === true) {
                const newFieldValues: ChangelogFieldValue[] = [];
                for (const [newFieldName, newFieldValue] of Object.entries(change.new)) {
                    if (newFieldName === 'id') {
                        continue;
                    }
                    newFieldValues.push({
                        field: newFieldName,
                        value: newFieldValue as string
                    });
                }

                return {
                    hasOld: hasOld,
                    hasNew: hasNew,
                    old: [],
                    new: newFieldValues
                }

            } else if (hasOld === true && hasNew === false) {
                const oldFieldValues: ChangelogFieldValue[] = [];
                for (const [oldFieldName, oldFieldValue] of Object.entries(change.old)) {
                    if (oldFieldName === 'id') {
                        continue;
                    }
                    oldFieldValues.push({
                        field: oldFieldName,
                        value: oldFieldValue as string
                    });
                }

                return {
                    hasOld: hasOld,
                    hasNew: hasNew,
                    old: oldFieldValues,
                    new: []
                }

            } else {
                // We have old AND new
                const newFieldValues: ChangelogFieldValue[] = [];
                const oldFieldValues: ChangelogFieldValue[] = [];
                for (const [newFieldName, newFieldValue] of Object.entries(change.new)) {
                    if (newFieldName === 'id') {
                        continue;
                    }
                    if (change.old.hasOwnProperty(newFieldName)) {
                        newFieldValues.push({
                            field: newFieldName,
                            value: newFieldValue as string
                        });
                        oldFieldValues.push({
                            field: newFieldName,
                            value: change.old[newFieldName] as string
                        });
                    }
                }

                return {
                    hasOld: true,
                    hasNew: true,
                    old: oldFieldValues,
                    new: newFieldValues
                }
            }
        }

        // Wo do NOT have "old" and "new" as keys
        // Add action
        const newFieldValues: ChangelogFieldValue[] = [];
        for (const newFieldName in change) {
            const newFieldValue = change[newFieldName];
            if (newFieldName === 'id') {
                continue;
            }
            newFieldValues.push({
                field: newFieldName,
                value: newFieldValue as string
            });
        }

        return {
            hasOld: false,
            hasNew: true,
            old: [],
            new: newFieldValues
        }
    }

    private parseApiResponseIntoTypescriptForArrayIsFalse(change: any): ChangelogEntryChange {
        const newFieldValues: ChangelogFieldValue[] = [];
        const oldFieldValues: ChangelogFieldValue[] = [];
        for (const [fieldName, value] of Object.entries(change)) {
            if (fieldName === 'id') {
                continue;
            }
            if (typeof value === "object" && value) {
                if (value.hasOwnProperty('new') && value.hasOwnProperty('old')) {
                    const valueTS = value as ChangelogArrayFalseOldNew;

                    // "Wir haben immer beide oder nichts" - Irina 24.04.2024
                    // This should only be "edit" actions

                    newFieldValues.push({
                        field: fieldName,
                        value: valueTS.new
                    });
                    oldFieldValues.push({
                        field: fieldName,
                        value: valueTS.old
                    });
                }
            }

            if (typeof value === "string" && value) {
                newFieldValues.push({
                    field: fieldName,
                    value: value as string
                });
            }

        }

        return {
            hasOld: oldFieldValues.length > 0,
            hasNew: newFieldValues.length > 0,
            old: oldFieldValues,
            new: newFieldValues
        }
    }
}
