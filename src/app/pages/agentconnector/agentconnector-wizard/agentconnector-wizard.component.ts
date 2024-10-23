import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTextDirective,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownDividerDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PaginatorModule } from 'primeng/paginator';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    AgentconnectorWizardProgressbarComponent
} from '../agentconnector-wizard-progressbar/agentconnector-wizard-progressbar.component';
import { AgentconnectorWizardStepsEnum } from '../agentconnector.enums';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { AgentconnectorWizardLoadHostsByStringParams, AgentModes } from '../agentconnector.interface';
import { AgentconnectorService } from '../agentconnector.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'oitc-agentconnector-wizard',
    standalone: true,
    imports: [
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
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        ItemSelectComponent,
        LabelLinkComponent,
        MatSort,
        MatSortHeader,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        PaginatorModule,
        PermissionDirective,
        RowComponent,
        SelectAllComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,
        AgentconnectorWizardProgressbarComponent,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        RequiredIconComponent,
        SelectComponent,
        CardTextDirective
    ],
    templateUrl: './agentconnector-wizard.component.html',
    styleUrl: './agentconnector-wizard.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentconnectorWizardComponent implements OnInit, OnDestroy {

    // Wizard step 1

    public hostId: number = 0;
    public pushAgentId: number = 0;
    public hosts: SelectKeyValue[] = [];
    public isConfigured: boolean = false;

    private subscriptions: Subscription = new Subscription();
    private readonly AgentconnectorService = inject(AgentconnectorService);
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private cdr = inject(ChangeDetectorRef);
    protected readonly AgentconnectorWizardStepsEnum = AgentconnectorWizardStepsEnum;


    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            // Query String Parameters
            const hostId = Number(params['hostId']) || 0;
            if (hostId > 0) {
                this.hostId = hostId;
            }

            const pushAgentId = Number(params['pushAgentId']) || 0;
            if (pushAgentId > 0) {
                this.pushAgentId = pushAgentId;
            }

            this.loadHosts('');
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadHosts = (searchString: string) => {
        const selected = [];
        if (this.hostId) {
            selected.push(this.hostId);
        }

        let params: AgentconnectorWizardLoadHostsByStringParams = {
            angular: true,
            'selected[]': selected,
            'filter[Hosts.name]': searchString,
            pushAgentId: this.pushAgentId
        }
        this.subscriptions.add(this.AgentconnectorService.loadHostsByString(params)
            .subscribe((result: SelectKeyValue[]) => {
                this.hosts = result;
                this.cdr.markForCheck();
            }));
    }

    public onHostChange() {
        this.isConfigured = false;

        if (this.hostId > 0) {
            this.subscriptions.add(this.AgentconnectorService.loadIsConfigured(this.hostId)
                .subscribe((result) => {
                    this.isConfigured = result;
                    this.cdr.markForCheck();
                }));
        }

    }

    protected readonly AgentModes = AgentModes;
}
