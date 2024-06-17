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
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    PopoverDirective,
    RowComponent,
} from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FilterBookmarkComponent } from '../filter-bookmark/filter-bookmark.component';
import { TagsInputComponent } from '../../tags-input/tags-input.component';
import { NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { RegexHelperTooltipComponent } from '../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { filter } from '../../../pages/services/services-index/services.interface';


type states = {
    ok: boolean,
    warning: boolean,
    critical: boolean,
    unknown: boolean
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
        PopoverDirective,
        RegexHelperTooltipComponent
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
            acknowledged: false,
            not_acknowledged: false,
            in_downtime: false,
            not_in_downtime: false,
            passive: false,
            active: false,
            notifications_enabled: false,
            notifications_not_enabled: false,
            output: '',
        },
        Services: {
            id: [],
            name: '',
            name_regex: false,
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
            name_regex: false,
            satellite_id: []
        }
    };

    public states: states = {
        ok: false,
        warning: false,
        critical: false,
        unknown: false
    }


    public onFilterChange(event: Event) {
        this.filterChange.emit(this.filter);
    }
    public onStateChange(event: Event) {
        const statesArray:string[] = [];
        if(this.states.ok) statesArray.push('ok');
        if(this.states.warning) statesArray.push('warning');
        if(this.states.critical) statesArray.push('critical');
        if(this.states.unknown) statesArray.push('unknown');
        this.filter.Servicestatus.current_state = statesArray;
        this.filterChange.emit(this.filter);
    }

}
