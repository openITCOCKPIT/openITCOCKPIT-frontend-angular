import { Component, inject } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
    DropdownComponent,
    DropdownDividerDirective,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective
} from '@coreui/angular';
import { XsButtonDirective } from '../xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { PermissionsService } from '../../../permissions/permissions.service';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { NgClass, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { UUID } from '../../../classes/UUID';
import { SearchService } from '../../../search/search.service';
import { SearchType } from '../../../search/search-type.enum';

@Component({
    selector: 'oitc-top-search',
    standalone: true,
    imports: [
        TranslocoDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        FormControlDirective,
        FormDirective,
        DropdownComponent,
        DropdownToggleDirective,
        DropdownMenuDirective,
        DropdownItemDirective,
        DropdownDividerDirective,
        XsButtonDirective,
        RouterLink,
        TranslocoPipe,
        PermissionDirective,
        NgClass,
        FaIconComponent,
        NgIf,
        FormsModule
    ],
    templateUrl: './top-search.component.html',
    styleUrl: './top-search.component.css'
})
export class TopSearchComponent {

    public readonly PermissionsService: PermissionsService = inject(PermissionsService)
    public readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly SearchService = inject(SearchService);

    public currentSearchType: SearchType = SearchType.Host;
    public currentSearchTypeTranslation: string = this.TranslocoService.translate('Hosts');
    public searchStr: string = '';

    public doSearch() {
        if (this.searchStr === '') {
            return;
        }

        const uuid = new UUID();
        if (uuid.isUuid(this.searchStr)) {
            this.setSearchType(SearchType.UUID, this.TranslocoService.translate('UUID'));
        }

        this.SearchService.search(this.currentSearchType, this.searchStr);
    }

    public setSearchType(searchType: SearchType, translation: string) {
        this.currentSearchType = searchType;
        this.currentSearchTypeTranslation = translation;
    }


    protected readonly SearchType = SearchType;
}
