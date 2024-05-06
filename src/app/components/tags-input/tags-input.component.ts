import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, inject } from '@angular/core';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

export interface Keyword {
    name: string;
}

@Component({
    selector: 'oitc-tags-input',
    standalone: true,
    imports: [MatFormFieldModule, MatChipsModule, MatIconModule, FaIconComponent],
    templateUrl: './tags-input.component.html',
    styleUrl: './tags-input.component.css'
})
export class TagsInputComponent {
    addOnBlur = true;
    readonly separatorKeysCodes = [ENTER, COMMA] as const;
    keywords: Keyword[] = [{name: 'Lemon'}, {name: 'Lime'}, {name: 'Apple'}];

    announcer = inject(LiveAnnouncer);

    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        // Add our fruit
        if (value) {
            this.keywords.push({name: value});
        }

        // Clear the input value
        event.chipInput!.clear();
    }

    remove(keyword: Keyword): void {
        const index = this.keywords.indexOf(keyword);

        if (index >= 0) {
            this.keywords.splice(index, 1);

            this.announcer.announce(`Removed ${keyword}`);
        }
    }

    edit(fruit: Keyword, event: MatChipEditedEvent) {
        const value = event.value.trim();

        // Remove fruit if it no longer has a name
        if (!value) {
            this.remove(fruit);
            return;
        }

        // Edit existing fruit
        const index = this.keywords.indexOf(fruit);
        if (index >= 0) {
            this.keywords[index].name = value;
        }
    }
}

