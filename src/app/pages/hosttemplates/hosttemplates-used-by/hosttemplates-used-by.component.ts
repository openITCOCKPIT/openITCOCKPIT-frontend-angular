import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HosttemplatesService } from '../hosttemplates.service';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    NavComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { NgIf } from '@angular/common';
import { NotUsedByObjectComponent } from '../../../layouts/coreui/not-used-by-object/not-used-by-object.component';

@Component({
    selector: 'oitc-hosttemplates-used-by',
    standalone: true,
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        NavComponent,
        PermissionDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        NgIf,
        NotUsedByObjectComponent
    ],
    templateUrl: './hosttemplates-used-by.component.html',
    styleUrl: './hosttemplates-used-by.component.css'
})
export class HosttemplatesUsedByComponent implements OnInit, OnDestroy {

    public total: number = 0;
    
    private subscriptions: Subscription = new Subscription();
    private HosttemplatesService = inject(HosttemplatesService);
    private router = inject(Router);
    private route = inject(ActivatedRoute)

    public ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load() {

    }

}
