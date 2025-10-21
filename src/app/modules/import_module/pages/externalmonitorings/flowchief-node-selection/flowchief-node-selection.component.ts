import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExternalMonitoringsService } from '../external-monitorings.service';
import { HistoryService } from '../../../../../history.service';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent,
    TextColorDirective
} from '@coreui/angular';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import {
    ExternalMonitoringWithFlowchiefNodesMembershipPost,
    FlowchiefNodesByStringParams,
    FlowchiefNodesMembership
} from '../external-monitorings.interface';
import { NgClass } from '@angular/common';
import { CopyToClipboardComponent } from '../../../../../layouts/coreui/copy-to-clipboard/copy-to-clipboard.component';

@Component({
    selector: 'oitc-flowchief-node-selection',
    imports: [
        FormFeedbackComponent,
        FormLabelDirective,
        MultiSelectComponent,
        TranslocoDirective,
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        ReactiveFormsModule,
        XsButtonDirective,
        RouterLink,
        FormLoaderComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        NgClass,
        TextColorDirective,
        CopyToClipboardComponent
    ],
    templateUrl: './flowchief-node-selection.component.html',
    styleUrl: './flowchief-node-selection.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlowchiefNodeSelectionComponent implements OnInit, OnDestroy {

    public post?: ExternalMonitoringWithFlowchiefNodesMembershipPost;
    public selectedNodes: number[] = [];
    public flowchiefNodes: SelectKeyValue[] = [];
    public errors: GenericValidationError | null = null;


    private subscriptions: Subscription = new Subscription();

    private readonly ExternalMonitoringsService = inject(ExternalMonitoringsService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.loadExternalMonitoringFlowchiefConfig(id);
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadExternalMonitoringFlowchiefConfig(id: number) {
        this.subscriptions.add(this.ExternalMonitoringsService.getFlowchiefNodeSelection(id).subscribe(response => {
            this.post = response;
            this.selectedNodes = response.flowchief_nodes_membership.map(item => item.flowchief_node_id);

            this.loadFlowchiefNodes('');
            this.cdr.markForCheck();
        }));
    }

    public loadFlowchiefNodes = (searchString: string): void => {
        const params: FlowchiefNodesByStringParams = {
            externalMonitoringId: this.post?.id || 0,
            'filter[FlowchiefNodes.path]': searchString,
            'selected[]': this.selectedNodes
        }

        this.subscriptions.add(this.ExternalMonitoringsService.loadFlowchiefNodesByString(params)
            .subscribe((result) => {
                this.flowchiefNodes = result;
                this.cdr.markForCheck();
            })
        );
    };

    public updateNodesMembership() {
        if (!this.post) {
            return;
        }

        // Cleanup if a node got deselected
        const flowchief_nodes_membership: FlowchiefNodesMembership[] = [];
        const alreadyInMembership: number[] = [];

        this.post.flowchief_nodes_membership.forEach((flowchief_node) => {
            if (this.selectedNodes.includes(flowchief_node.flowchief_node_id)) {
                flowchief_nodes_membership.push(flowchief_node);
            }
            alreadyInMembership.push(flowchief_node.flowchief_node_id);
        });

        // All selected nodes to membership (so we can sret is_recursive properly)
        this.selectedNodes.forEach((nodeId) => {
            let externalMonitoringId = 0;
            if (this.post && this.post.id) {
                // This is just to make TypeScript happy
                externalMonitoringId = this.post.id;
            }

            if (!alreadyInMembership.includes(nodeId)) {

                const node = this.flowchiefNodes.find(n => n.key === nodeId);
                if (node) {
                    flowchief_nodes_membership.push({
                        flowchief_node_id: nodeId,
                        external_monitoring_id: externalMonitoringId,
                        is_recursive: false,
                        path: node.value // only used by the Angular Frontend
                    });
                }
            }
        });

        this.post.flowchief_nodes_membership = flowchief_nodes_membership;
    }

    public submit() {
        if (!this.post) {
            return;
        }

        this.subscriptions.add(this.ExternalMonitoringsService.editFlowchiefNodeSelection(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('FlowChief Nodes');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['import_module', 'ExternalMonitorings', 'flowchiefNodeSelection', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/import_module/ExternalMonitorings/index']);
                    this.notyService.scrollContentDivToTop();
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

}
