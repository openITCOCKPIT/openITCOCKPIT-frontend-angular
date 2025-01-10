import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';


import {
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardTextDirective,
  CardTitleDirective,
  ColComponent,
  FormLabelDirective,
  RowComponent
} from '@coreui/angular';


import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';



import { NgIf } from '@angular/common';


import { PaginatorModule } from 'primeng/paginator';
import { PermissionDirective } from '../../../permissions/permission.directive';


import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    AgentconnectorWizardProgressbarComponent
} from '../agentconnector-wizard-progressbar/agentconnector-wizard-progressbar.component';
import { AgentconnectorWizardStepsEnum } from '../agentconnector.enums';


import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { AgentconnectorWizardLoadHostsByStringParams, AgentModes } from '../agentconnector.interface';
import { AgentconnectorService } from '../agentconnector.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'oitc-agentconnector-wizard',
    imports: [
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FaIconComponent,
    FormsModule,
    NgIf,
    PaginatorModule,
    PermissionDirective,
    RowComponent,
    TranslocoDirective,
    XsButtonDirective,
    RouterLink,
    AgentconnectorWizardProgressbarComponent,
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
            if (this.hostId > 0) {
                this.onHostChange();
            }
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
            'filter[Hosts.name]': searchString
        }

        if (this.pushAgentId > 0) {
            params['pushAgentId'] = this.pushAgentId;
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
