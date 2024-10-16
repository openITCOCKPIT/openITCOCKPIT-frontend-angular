import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import {
    QueryHandlerCheckerComponent
} from '../../../layouts/coreui/query-handler-checker/query-handler-checker.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';
import { AutomapsViewParams, AutomapsViewRoot, getDefaultAutomapsViewParams } from '../automaps.interface';
import { Subscription } from 'rxjs';
import { AutomapsService } from '../automaps.service';
import { NgIf } from '@angular/common';
import { AutomapViewerComponent } from './automap-viewer/automap-viewer.component';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';

@Component({
    selector: 'oitc-automaps-view',
    standalone: true,
    imports: [

        FaIconComponent,
        PermissionDirective,
        QueryHandlerCheckerComponent,
        TranslocoDirective,
        RouterLink,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        BackButtonDirective,
        BlockLoaderComponent,
        NgIf,
        AutomapViewerComponent
    ],
    templateUrl: './automaps-view.component.html',
    styleUrl: './automaps-view.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutomapsViewComponent implements OnInit, OnDestroy {

    public result!: AutomapsViewRoot;
    public params: AutomapsViewParams = getDefaultAutomapsViewParams();

    private id: number = 0;
    private subscriptions: Subscription = new Subscription();
    public readonly AutomapsService = inject(AutomapsService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.id = Number(this.route.snapshot.paramMap.get('id'));
            this.loadAutomap();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadAutomap() {
        this.subscriptions.add(this.AutomapsService.view(this.id, this.params).subscribe(result => {
            this.result = result;
            this.cdr.markForCheck();
        }));
    }

    public onPaginatorChange(change: PaginatorChangeEvent) {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadAutomap();
    }
}
