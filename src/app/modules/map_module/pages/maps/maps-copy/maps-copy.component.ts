import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { NgForOf, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GenericValidationError } from '../../../../../generic-responses';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { HistoryService } from '../../../../../history.service';
import { MapsService } from '../Maps.service';
import { MapCopyPost } from '../Maps.interface';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';


@Component({
    selector: 'oitc-maps-copy',
    imports: [
    BackButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FaIconComponent,
    FormControlDirective,
    FormErrorDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    NavComponent,
    NgForOf,
    PermissionDirective,
    ReactiveFormsModule,
    RequiredIconComponent,
    TranslocoDirective,
    XsButtonDirective,
    RouterLink,
    FormsModule,
    FormLoaderComponent,
    NgIf,
    BackButtonDirective,
    NavItemComponent
],
    templateUrl: './maps-copy.component.html',
    styleUrl: './maps-copy.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapsCopyComponent implements OnInit, OnDestroy {
    public sourceMaps: MapCopyPost[] = [];
    public errors: GenericValidationError | null = null;

    private subscriptions: Subscription = new Subscription()
    private MapsService: MapsService = inject(MapsService);
    private readonly notyService: NotyService = inject(NotyService);
    private router: Router = inject(Router);
    private route: ActivatedRoute = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        const ids = String(this.route.snapshot.paramMap.get('ids')).split(',').map(Number);
        if (!ids) {
            // No ids given
            this.router.navigate(['/', 'map_module', 'maps', 'index']);
            return;
        }

        this.subscriptions.add(this.MapsService.getMapsCopy(ids).subscribe(maps => {
            for (let map of maps) {
                this.sourceMaps.push(<MapCopyPost>{
                    Source: {
                        id: map.id,
                        name: map.name,
                        title: map.title,
                        refresh_interval: map.refresh_interval / 1000
                    },

                    Map: {
                        name: map.name,
                        title: map.title,
                        refresh_interval: map.refresh_interval / 1000
                    },
                    Error: null
                })
            }
            this.cdr.markForCheck();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe()
    }

    protected copyMaps() {
        this.subscriptions.add(
            this.MapsService.saveMapsCopy(this.sourceMaps).subscribe({
                next: (value: any) => {
                    this.notyService.genericSuccess();
                    this.HistoryService.navigateWithFallback(['/map_module/maps/index']);
                },
                error: (error: HttpErrorResponse) => {
                    this.notyService.genericError();
                    this.sourceMaps = error.error.result as MapCopyPost[];
                    this.cdr.markForCheck();
                }
            })
        );
    }
}
