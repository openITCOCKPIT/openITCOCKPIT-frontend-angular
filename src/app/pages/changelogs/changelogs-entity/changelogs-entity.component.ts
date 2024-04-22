import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
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
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { ChangelogsIndexParams, getDefaultChangelogsIndexParams } from '../changelogs.interface';
import { Subscription } from 'rxjs';
import { ChangelogsService } from '../changelogs.service';

@Component({
    selector: 'oitc-changelogs-entity',
    standalone: true,
    imports: [
        CoreuiComponent,
        TranslocoDirective,
        RouterLink,
        FaIconComponent,
        PermissionDirective,
        CardComponent,
        CardHeaderComponent,
        NavComponent,
        NavItemComponent,
        CardTitleDirective,
        XsButtonDirective,
        CardBodyComponent,
        ColComponent,
        ContainerComponent,
        FormDirective,
        FormsModule,
        ReactiveFormsModule,
        RowComponent,
        DebounceDirective,
        FormControlDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        TranslocoPipe,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective
    ],
    templateUrl: './changelogs-entity.component.html',
    styleUrl: './changelogs-entity.component.css'
})
export class ChangelogsEntityComponent implements OnInit, OnDestroy {
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);

    public hideFilter: boolean = false;
    public params: ChangelogsIndexParams = getDefaultChangelogsIndexParams();
    private subscriptions: Subscription = new Subscription();
    private ChangelogsService = inject(ChangelogsService)
    private changes: any;


    loadChanges() {
        this.subscriptions.add(this.ChangelogsService.getIndex(this.params)
            .subscribe((result: any) => {
                this.changes = result;
            })
        );
    }

    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public ngOnDestroy(): void {
    }

    public ngOnInit() {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);
            this.loadChanges();
        }));
    }

    public onFilterChange($event: any) {

    }
}
