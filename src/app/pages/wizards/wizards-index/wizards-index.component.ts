import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
    AlertComponent,
    ButtonGroupComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    ColComponent,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { WizardsService } from '../wizards.service';
import { WizardsIndex } from '../wizards.interface';
import { KeyValuePipe, NgClass, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-wizards-index',
    standalone: true,
    imports: [
        RowComponent,
        ColComponent,
        NgIf,
        NgForOf,
        KeyValuePipe,
        CardComponent,
        CardBodyComponent,
        NgOptimizedImage,
        CardFooterComponent,
        FaIconComponent,
        BadgeOutlineComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        CardHeaderComponent,
        BackButtonDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        ButtonGroupComponent,
        TranslocoPipe,
        NgClass,
        AlertComponent
    ],
    templateUrl: './wizards-index.component.html',
    styleUrl: './wizards-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardsIndexComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly WizardsService: WizardsService = inject(WizardsService);
    private readonly modalService: ModalService = inject(ModalService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    protected filter: any = {
        Category: {
            linux: true,
            windows: true,
            database: true,
            mail: true,
            network: true,
            docker: true,
            macos: true,
            virtualization: true,
            hardware: true
        }
    }

    protected result?: WizardsIndex;

    protected filterCategory(category: string): void {

    }

    public ngOnInit() {
        this.loadWizards();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private loadWizards(): void {
        this.subscriptions.add(this.WizardsService.getIndex()
            .subscribe((result: WizardsIndex) => {
                this.result = result;
                this.cdr.markForCheck();
            }))
    }

    protected filterByCategory(categories: string[]): boolean {
        // Traverse all categories

        for (let i = 0; i < categories.length; i++) {
            if (this.filter.Category[categories[i]]) {
                return true;
            }
        }
        return false;
    }

}
