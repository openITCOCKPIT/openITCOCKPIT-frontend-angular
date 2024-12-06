import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import {
    ColComponent,
    FormCheckInputDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { NgSelectComponent } from '@ng-select/ng-select';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { Service, WizardPost } from '../../../pages/wizards/wizards.interface';

@Component({
    selector: 'oitc-wizards-dynamicfields',
    standalone: true,
    imports: [
        ColComponent,
        FaIconComponent,
        FormCheckInputDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        NgForOf,
        NgIf,
        NgSelectComponent,
        RowComponent,
        TranslocoPipe,
        TranslocoDirective
    ],
    templateUrl: './wizards-dynamicfields.component.html',
    styleUrl: './wizards-dynamicfields.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardsDynamicfieldsComponent {
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    protected searchedTags: string[] = [];


    @Input({required: true}) post: WizardPost = {} as WizardPost;
    @Input({required: true}) title: string = '';

    protected hasName = (name: string): boolean => {
        if (this.searchedTags.length === 0) {
            return true;
        }
        return this.searchedTags.some((tag) => {
            return name.toLowerCase().includes(tag.toLowerCase());
        });
    }

    protected toggleCheck(): void {
        this.post.services.forEach((service: Service) => {
            if (!this.hasName(service.name)) {
                return;
            }
            service.createService = !service.createService
        });
        this.cdr.markForCheck();
    }

    protected search = (): void => {
        console.warn(this.searchedTags);
        this.cdr.markForCheck();
    }
    protected detectColor = function (label: string): string {
        if (label.match(/warning/gi)) {
            return 'warning';
        }

        if (label.match(/critical/gi)) {
            return 'critical';
        }

        return '';
    };
}
