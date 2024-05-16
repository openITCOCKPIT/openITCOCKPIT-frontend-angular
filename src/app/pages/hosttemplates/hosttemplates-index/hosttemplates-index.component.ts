import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    getDefaultHosttemplatesIndexParams,
    HosttemplateIndexRoot,
    HosttemplatesIndexParams
} from '../hosttemplates.interface';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { CommandTypesEnum } from '../../commands/command-types.enum';
import { HosttemplateTypesEnum } from '../hosttemplate-types.enum';
import { HosttemplatesService } from '../hosttemplates.service';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'oitc-hosttemplates-index',
    standalone: true,
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        ColComponent,
        ContainerComponent,
        DebounceDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        ReactiveFormsModule,
        RowComponent,
        TranslocoPipe,
        FormErrorDirective,
        NgSelectModule,
        NgOptionHighlightModule,
        JsonPipe
    ],
    templateUrl: './hosttemplates-index.component.html',
    styleUrl: './hosttemplates-index.component.css'
})
export class HosttemplatesIndexComponent implements OnInit, OnDestroy {

    public params: HosttemplatesIndexParams = getDefaultHosttemplatesIndexParams();
    public hosttemplates?: HosttemplateIndexRoot;
    public hideFilter: boolean = true;

    public hosttemplateTypes: any[] = [];

    private readonly HosttemplatesService = inject(HosttemplatesService);
    private subscriptions: Subscription = new Subscription();


    public ngOnInit() {
        this.hosttemplateTypes = this.HosttemplatesService.getHosttemplateTypes();
        this.loadHosttemplates();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadHosttemplates() {
        console.log('Load Host templates', new Date())
        console.log(this.params);
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.loadHosttemplates();
    }

    public resetFilter() {
        this.params = getDefaultHosttemplatesIndexParams();
        this.loadHosttemplates();
    }

    protected readonly CommandTypesEnum = CommandTypesEnum;
    protected readonly HosttemplateTypesEnum = HosttemplateTypesEnum;
}
