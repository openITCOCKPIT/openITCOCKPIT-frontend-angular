import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { SystemsettingsService } from '../systemsettings.service';
import { Subscription } from 'rxjs';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import {
    AlertComponent,
    AlertHeadingDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownDividerDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormSelectDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective,
    TooltipDirective
} from '@coreui/angular';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { KeyValuePipe, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { SystemsettingsCategories } from '../systemsettings.interface';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { NgSwitchMultiCasePipe } from '../../../pipes/ng-switch-multi-case.pipe';
import {
    ReloadInterfaceModalComponent
} from '../../../layouts/coreui/reload-interface-modal/reload-interface-modal.component';
import { NotyService } from '../../../layouts/coreui/noty.service';

@Component({
    selector: 'oitc-systemsettings-index',
    standalone: true,
    imports: [
        CoreuiComponent,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        DebounceDirective,
        DeleteAllModalComponent,
        DropdownDividerDirective,
        FaIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        ItemSelectComponent,
        MatSort,
        MatSortHeader,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        PermissionDirective,
        RowComponent,
        SelectAllComponent,
        TableDirective,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,
        AlertComponent,
        AlertHeadingDirective,
        TooltipDirective,
        KeyValuePipe,
        BackButtonDirective,
        FormSelectDirective,
        NgSwitch,
        NgSwitchCase,
        NgSwitchMultiCasePipe,
        NgSwitchDefault,
        ReloadInterfaceModalComponent
    ],
    templateUrl: './systemsettings-index.component.html',
    styleUrl: './systemsettings-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemsettingsIndexComponent implements OnInit, OnDestroy {

    public SystemsettingsCategories?: SystemsettingsCategories;
    public archiveAgeOptions: string[] = this.generateArchiveAgeOptions();

    private readonly SystemsettingsService = inject(SystemsettingsService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly modalService = inject(ModalService);
    private readonly notyService = inject(NotyService);

    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.subscriptions.add(
            this.SystemsettingsService.getIndex().subscribe(data => {
                this.SystemsettingsCategories = data;
                this.cdr.markForCheck();
            })
        );
    }

    public generateArchiveAgeOptions(): string[] {
        let options: string[] = [];
        for (var i = 1; i < 107; i++) {
            options.push(String(i));
        }
        return options;
    }

    public getAnonymousStatisticsValue(state: string): string {
        switch (state) {
            case '0':
                return this.TranslocoService.translate('Anonymous statistics are disabled');
            case '1':
                return this.TranslocoService.translate('Anonymous statistics are enabled');
            case '2':
                return this.TranslocoService.translate('Anonymous statistics are disabled - Waiting for your approval');
            default:
                return this.TranslocoService.translate('Anonymous statistics are disabled - Waiting for your approval');
        }
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public submit(): void {
        if (this.SystemsettingsCategories) {
            this.subscriptions.add(this.SystemsettingsService.updateSystemsettings(this.SystemsettingsCategories)
                .subscribe((result) => {
                    this.cdr.markForCheck();
                    if (result.success) {

                        this.notyService.genericSuccess();

                        // open modal page reload modal
                        this.modalService.toggle({
                            show: true,
                            id: 'reloadInterfaceModal',
                        });

                        return;
                    }

                    // Error
                    this.notyService.genericError();
                })
            );
        }
    }

}
