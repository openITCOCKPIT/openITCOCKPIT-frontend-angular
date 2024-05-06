import {
    Component,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ColComponent,
    FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent,
} from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FilterBookmarkComponent } from '../filter-bookmark/filter-bookmark.component';
import { TagsInputComponent } from '../../tags-input/tags-input.component';
import {NgIf} from '@angular/common';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import { DebounceDirective } from '../../../directives/debounce.directive';

type filter = {
    Servicestatus: {
        current_state: string[],
        acknowledged: boolean | string,
        not_acknowledged: boolean | string,
        in_downtime: boolean |string,
        not_in_downtime: boolean | string,
        passive: boolean | string,
        active: boolean | string,
        notifications_enabled: boolean | string,
        output: string,
    },
    Services: {
        id: number[],
        name: string,
        name_regex: boolean | string,
        keywords:string[],
        not_keywords: string[],
        servicedescription: string,
        priority: {
            1: boolean,
            2: boolean,
            3: boolean,
            4: boolean,
            5: boolean
        },
        service_type: number[]
    },
    Hosts: {
        id: number[],
        name: string,
        name_regex: boolean | string,
        satellite_id: number[]
    }
}

@Component({
    selector: 'oitc-services-index-filter',
    standalone: true,
    imports: [
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        TranslocoDirective,
        FaIconComponent,
        FilterBookmarkComponent,
        NgIf,
        RowComponent,
        ColComponent,
        InputGroupComponent,
        InputGroupTextDirective,
        FormControlDirective,
        FormCheckComponent,
        TagsInputComponent,
        NgSelectModule,
        FormsModule,
        DebounceDirective,
        FormCheckInputDirective,
        FormCheckLabelDirective,
    ],
    templateUrl: './services-index-filter.component.html',
    styleUrl: './services-index-filter.component.css'
})
export class ServicesIndexFilterComponent {
    @Input() set show (show: boolean) {
        this.showFilter = show;
    }
    @Output() filterChange = new EventEmitter<filter>();
    public showFilter: boolean = false;

    public filter: filter = {
        Servicestatus: {
            current_state: [],
            acknowledged: '',
            not_acknowledged: '',
            in_downtime: '',
            not_in_downtime: '',
            passive: '',
            active: '',
            notifications_enabled: '',
            output: '',
        },
        Services: {
            id: [],
            name: '',
            name_regex: '',
            keywords:[],
            not_keywords: [],
            servicedescription: '',
            priority: {
                1: false,
                2: false,
                3: false,
                4: false,
                5: false
            },
            service_type: []
        },
        Hosts: {
            id: [],
            name: '',
            name_regex: '',
            satellite_id: []
        }
    }


    public onFilterChange(event: Event) {
        this.filterChange.emit(this.filter);
    }
}
