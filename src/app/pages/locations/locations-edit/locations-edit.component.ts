import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { UserTimezonesSelect } from '../../users/users.interface';
import { LocationPost } from '../locations.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { VectormapMarker } from '../../../components/vectormap/vactormap.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckInputDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { VectormapComponent } from '../../../components/vectormap/vectormap.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { LocationsService } from '../locations.service';
import { UsersService } from '../../users/users.service';
import { HistoryService } from '../../../history.service';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';

@Component({
    selector: 'oitc-locations-edit',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormCheckInputDirective,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        NgOptionTemplateDirective,
        NgSelectComponent,
        PermissionDirective,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        VectormapComponent,
        XsButtonDirective,
        FormLoaderComponent,
        NgIf,
        RouterLink,
        NgOptionHighlightDirective
    ],
    templateUrl: './locations-edit.component.html',
    styleUrl: './locations-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationsEditComponent implements OnInit, OnDestroy {

    public containers: SelectKeyValue[] = [];
    public timezones: UserTimezonesSelect[] = [];
    public post!: LocationPost;
    public errors: GenericValidationError | null = null;

    // For the map only
    public markers: VectormapMarker[] = [];

    private subscriptions: Subscription = new Subscription();
    private readonly LocationsService = inject(LocationsService);
    private readonly UsersService = inject(UsersService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.loadLocation(id);
            this.loadContainers();
            this.loadTimezones();
        });
    }


    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadLocation(id: number) {
        this.subscriptions.add(this.LocationsService.getLocationEdit(id).subscribe(location => {
            this.post = location;
            this.updateMarker();
            this.cdr.markForCheck();
        }));
    }

    public loadContainers() {
        this.subscriptions.add(this.LocationsService.loadContainers().subscribe(containers => {
            this.containers = containers;
            this.cdr.markForCheck();
        }));
    }

    public loadTimezones() {
        this.subscriptions.add(this.UsersService.getDateformats().subscribe(data => {
            this.timezones = data.timezones;
            this.cdr.markForCheck();
        }));
    }

    public submit() {
        this.subscriptions.add(this.LocationsService.saveLocationEdit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Location');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['locations', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/locations/index']);
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            }));
    }

    public updateMarker() {
        const latitude = Number(this.post.latitude);
        const longitude = Number(this.post.longitude);

        // If we pass wrong values to the map, the marker of the map will fail
        if (latitude <= 90 && latitude >= -90 && longitude <= 180 && longitude >= -180) {
            const marker: VectormapMarker = {
                name: this.post.container.name,
                coords: [latitude, longitude],
                style: {
                    initial: {
                        fill: '#6261cc'
                    }
                }
            };
            this.cdr.markForCheck();
            this.markers = [marker];
        }
    }
}
