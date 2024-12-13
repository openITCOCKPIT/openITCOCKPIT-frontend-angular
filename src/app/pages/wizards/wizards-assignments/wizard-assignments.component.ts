import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    BadgeComponent,
    ButtonGroupComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ColComponent,
    ContainerComponent,
    DropdownDividerDirective,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { KeyValuePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { WizardsService } from '../wizards.service';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { WizardsIndex } from '../wizards.interface';

@Component({
    selector: 'oitc-wizard-assignments',
    standalone: true,
    imports: [
        RouterLink,
        TranslocoDirective,
        FaIconComponent,
        ButtonGroupComponent,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        NgClass,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        BadgeOutlineComponent,
        ColComponent,
        ContainerComponent,
        DropdownDividerDirective,
        ItemSelectComponent,
        MatSort,
        MatSortHeader,
        NgForOf,
        NgIf,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        PermissionDirective,
        RowComponent,
        SelectAllComponent,
        TableDirective,
        TableLoaderComponent,
        KeyValuePipe,
        BadgeComponent
    ],
    templateUrl: './wizard-assignments.component.html',
    styleUrl: './wizard-assignments.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardAssignmentsComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly WizardsService: WizardsService = inject(WizardsService);
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

    protected readonly Object = Object;
}
