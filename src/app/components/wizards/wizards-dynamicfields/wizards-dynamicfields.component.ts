import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    inject,
    input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
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
export class WizardsDynamicfieldsComponent implements OnChanges {
    public cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    protected searchedTags: string[] = [];

    public post = input.required<WizardPost>();
    public title = input.required<string>();

    constructor() {
        effect(() => {
            this.cdr.markForCheck();
        });
    }

    protected hasName = (name: string): boolean => {
        if (this.searchedTags.length === 0) {
            return true;
        }
        return this.searchedTags.some((tag) => {
            return name.toLowerCase().includes(tag.toLowerCase());
        });
    }

    protected toggleCheck(theService: Service | undefined): void {
        if (theService) {
            this.post().services.forEach((service: Service) => {
                if (service.servicetemplate_id === theService.servicetemplate_id) {
                    service.createService = !service.createService;
                }
            });
            this.cdr.markForCheck();
            return;
        }
        this.post().services.forEach((service: Service) => {
            if (!this.hasName(service.name)) {
                return;
            }
            service.createService = !service.createService
        });
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

    public ngOnChanges(changes: SimpleChanges): void {
        this.cdr.markForCheck();
    }
}
