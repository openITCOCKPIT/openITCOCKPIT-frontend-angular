import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    EvcModalService,
    EvcServiceSelect,
    EvcToggleModal,
    EvcTree,
    EvcTreeItem,
    EventcorrelationRootElement,
    getDefaultEvcModalService
} from '../eventcorrelations.interface';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventcorrelationsService } from '../eventcorrelations.service';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { BlockLoaderComponent } from '../../../../../layouts/primeng/loading/block-loader/block-loader.component';
import {
    ButtonCloseDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormControlDirective,
    FormLabelDirective,
    FormSelectDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { EvcTreeComponent } from '../eventcorrelations-view/evc-tree/evc-tree.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { EvcTreeEditComponent } from './evc-tree-edit/evc-tree-edit.component';
import {
    SelectItemOptionGroup,
    SelectKeyValue,
    SelectKeyValueString
} from '../../../../../layouts/primeng/select.interface';
import { EventcorrelationOperators } from '../eventcorrelations.enum';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { PaginatorModule } from 'primeng/paginator';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { GenericValidationError } from '../../../../../generic-responses';
import { NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { LabelLinkComponent } from '../../../../../layouts/coreui/label-link/label-link.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import {
    MultiSelectOptgroupComponent
} from '../../../../../layouts/primeng/multi-select/multi-select-optgroup/multi-select-optgroup.component';
import _ from 'lodash';
import { SelectItem } from 'primeng/api/selectitem';

@Component({
    selector: 'oitc-eventcorrelations-edit-correlation',
    standalone: true,
    imports: [
        BackButtonDirective,
        BlockLoaderComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        EvcTreeComponent,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        NgIf,
        PermissionDirective,
        RowComponent,
        TranslocoDirective,
        XsButtonDirective,
        EvcTreeEditComponent,
        NgClass,
        RouterLink,
        ButtonCloseDirective,
        ModalBodyComponent,
        ModalComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        ModalFooterComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        PaginatorModule,
        RequiredIconComponent,
        TranslocoPipe,
        NgOptionTemplateDirective,
        NgSelectComponent,
        FormSelectDirective,
        LabelLinkComponent,
        SelectComponent,
        MultiSelectOptgroupComponent
    ],
    templateUrl: './eventcorrelations-edit-correlation.component.html',
    styleUrl: './eventcorrelations-edit-correlation.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventcorrelationsEditCorrelationComponent implements OnInit, OnDestroy {
    private readonly TranslocoService = inject(TranslocoService);

    public id: number = 0;

    public evcTree: EvcTree[] = [];
    public rootElement?: EventcorrelationRootElement;
    public servicetemplates: SelectKeyValue[] = [];
    public hasWritePermission: boolean = false;

    public showInfoForDisabledService: number = 0;
    public disabledServices: number = 0; //number of disabled services in the EVC
    public stateForDisabledService: number = 3; // Unknown

    public downtimedServices: number = 0; //number of services in a downtime in the EVC
    public stateForDowntimedService: number = 3; // Unknown

    /** EVC Service Modal variables */
    public modalCurrentLayerIndex: number = 0;
    public modalVService?: EvcModalService;
    public modalServicesForSelect: SelectItemOptionGroup[] = [];

    public modalOperators: SelectKeyValueString[] = [
        {key: EventcorrelationOperators.AND, value: this.TranslocoService.translate('AND')},
        {key: EventcorrelationOperators.OR, value: this.TranslocoService.translate('OR')},
        {key: EventcorrelationOperators.EQ, value: this.TranslocoService.translate('EQUAL')},
        {key: EventcorrelationOperators.MIN, value: this.TranslocoService.translate('MIN')}
    ];
    public errors: GenericValidationError | null = null;

    private subscriptions: Subscription = new Subscription();
    private readonly EventcorrelationsService = inject(EventcorrelationsService);
    private readonly modalService: ModalService = inject(ModalService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.id = Number(this.route.snapshot.paramMap.get('id'));
            this.loadEventcorrelation();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadEventcorrelation() {
        this.subscriptions.add(this.EventcorrelationsService.getEventcorrelationEditCorrelation(this.id).subscribe((result) => {
            this.cdr.markForCheck();

            this.evcTree = result.evcTree;
            this.rootElement = result.rootElement;
            this.servicetemplates = result.servicetemplates;
            this.showInfoForDisabledService = result.showInfoForDisabledService;
            this.stateForDisabledService = result.stateForDisabledService;
            this.disabledServices = result.disabledServices;

            this.downtimedServices = result.downtimedServices;
            this.stateForDowntimedService = result.stateForDowntimedService;

        }));
    }

    public showAddVServiceModal(layerIndex: number): void {
        this.modalCurrentLayerIndex = layerIndex;

        this.modalVService = getDefaultEvcModalService(this.id, layerIndex);

        if (layerIndex === 0) {
            //Load "real" services for the first layer
            //Use "real" service ids from the database (services.id)
            this.subscriptions.add(this.EventcorrelationsService.loadServices('', this.id, this.getServicesIdsByLayerIndex(0)).subscribe((services) => {
                this.modalServicesForSelect = this.reformatServicesForOptionGroupSelect(services);
                this.cdr.markForCheck();
            }));
        }

        if (layerIndex > 0) {
            //Load "virtual" services for current layer
            //All other layers use the evcId_vService as key in the select box => 5_vService
            this.cdr.markForCheck();
            this.modalServicesForSelect = [];

            const services = this.getServicesByLayerIndexForSelect(layerIndex);
            this.modalServicesForSelect = this.reformatServicesForOptionGroupSelect(services);
        }

        this.modalService.toggle({
            show: true,
            id: 'evcVServicesModal'
        });
    }

    public showEditVServiceModal(layerIndex: number, eventCorrelation: EvcTreeItem) {
        this.modalCurrentLayerIndex = layerIndex - 1;
        let layerIndexToLoadServicesFrom = layerIndex - 1;

        const operator = this.getParsedOperator(eventCorrelation.operator);
        this.modalVService = {
            servicename: String(eventCorrelation.service.name),
            servicetemplate_id: eventCorrelation.service.servicetemplate_id,
            service_ids: this.getServicesIdsByLayerIndexAndParentId(layerIndexToLoadServicesFrom, eventCorrelation.id),
            operator: operator.operator,
            operator_modifier: operator.modifier,
            current_evc: {
                id: this.id,
                layerIndex: layerIndex,
                mode: 'edit',
                evc_node_id: eventCorrelation.id,
                old_service_ids: this.getServicesIdsByLayerIndexAndParentId(layerIndexToLoadServicesFrom, eventCorrelation.id)
            }
        };

        if (layerIndexToLoadServicesFrom === 0) {
            //Load "real" services for the first layer
            //Use "real" service ids from the database (services.id)
            this.subscriptions.add(this.EventcorrelationsService.loadServices('', this.id, this.getServicesIdsByLayerIndex(0)).subscribe((services) => {
                this.modalServicesForSelect = this.reformatServicesForOptionGroupSelect(services);
                this.cdr.markForCheck();
            }));
        }

        if (layerIndexToLoadServicesFrom > 0) {
            //Load "virtual" services for current layer
            //All other layers use the evcId_vService as key in the select box => 5_vService
            this.cdr.markForCheck();
            this.modalServicesForSelect = [];

            const services = this.getServicesByLayerIndexForSelect(layerIndexToLoadServicesFrom, eventCorrelation.id);
            this.modalServicesForSelect = this.reformatServicesForOptionGroupSelect(services);
        }

        this.modalService.toggle({
            show: true,
            id: 'evcVServicesModal'
        });
    }

    /**
     * Get all service_id's as array by layerIndex
     * @param layerIndex
     * @private
     */
    private getServicesIdsByLayerIndex(layerIndex: number): number[] {
        const layerServices = this.getServicesByLayerIndex(layerIndex);
        const layerServicesIds: number[] = [];

        layerServices.forEach((service) => {
            layerServicesIds.push(service.service_id);
        });

        return layerServicesIds;
    }

    /**
     * Get all services as object by layerIndex
     * @param layerIndex
     * @private
     */
    private getServicesByLayerIndex(layerIndex: number | string): EvcTreeItem[] {
        const layerServices: EvcTreeItem[] = [];
        layerIndex = String(layerIndex);

        for (let evcLayer in this.evcTree) {
            if (evcLayer !== layerIndex) {
                continue;
            }

            for (let services in this.evcTree[evcLayer]) {
                for (let eventCorrelation in this.evcTree[evcLayer][services]) {

                    const evc = this.evcTree[evcLayer][services][eventCorrelation];
                    layerServices.push(evc)
                }
            }
        }

        return layerServices;
    }

    /**
     * Returns all services of a given layerIndex
     * @param layerIndex
     * @param currentEvcId
     * @private
     */
    private getServicesByLayerIndexForSelect(layerIndex: number | string, currentEvcId?: number | undefined): EvcServiceSelect[] {
        const servicesInLayer = this.getServicesByLayerIndex(layerIndex);
        const services: EvcServiceSelect[] = [];

        servicesInLayer.forEach((service) => {
            let evcIdAsString = String(service.id);

            //Add _vService suffix if missing (vServices loaded from database don't have the _vService suffix)
            if (!evcIdAsString.endsWith('_vService')) {
                evcIdAsString = evcIdAsString + '_vService';
            }

            let vServiceInUse = service.parent_id !== null; //used by add modal
            if (currentEvcId) {
                if (service.parent_id === currentEvcId) { //used by edit modal
                    vServiceInUse = false;
                }
            }


            services.push({
                key: evcIdAsString,
                value: {
                    Service: {
                        id: evcIdAsString,
                        name: service.service.name,
                        servicename: service.service.servicename
                    },
                    Host: {
                        id: service.service.host.id,
                        name: service.service.host.name
                    },
                },
                vServiceInUse: vServiceInUse
            });
        });

        return services;
    }

    /**
     * Get all service_id's as array by layerIndex and parentId
     * @param layerIndex
     * @param parentId
     * @private
     */
    private getServicesIdsByLayerIndexAndParentId(layerIndex: number, parentId: number): (number | string)[] {
        const layerServices = this.getServicesByLayerIndex(layerIndex);
        const layerServicesIds: (number | string)[] = [];

        layerServices.forEach((service) => {
            if (service.parent_id === parentId) {
                if (layerIndex === 0) {
                    layerServicesIds.push(service.service_id);
                } else {
                    layerServicesIds.push(service.id + '_vService');
                }
            }
        });

        return layerServicesIds;
    }

    /**
     * Parse the operator string and return the operator and modifier
     * @param operatorString
     * @private
     */
    private getParsedOperator(operatorString: string | null): {
        modifier: number,
        operator: EventcorrelationOperators | null
    } {

        if (operatorString === null) {
            return {
                operator: null,
                modifier: 0
            };
        }

        operatorString = operatorString.toLowerCase();
        const first3Chars = operatorString.substring(0, 3);

        // switch in case we add more operators in the future
        switch (first3Chars) {
            case 'min':
                //min1, min 10, min300
                return {
                    operator: EventcorrelationOperators.MIN,
                    modifier: parseInt(operatorString.substring(3), 10)
                };

            default:
                //AND, OR, EQ
                return {
                    operator: operatorString as EventcorrelationOperators,
                    modifier: 0
                };
        }
    }

    public toggleVServiceModal(event: EvcToggleModal) {
        if (event.mode === 'add') {
            this.showAddVServiceModal(event.layerIndex);
        }

        if (event.mode === 'edit' && event.eventCorrelation) {
            this.showEditVServiceModal(event.layerIndex, event.eventCorrelation);
        }
    }

    public hideModal() {
        this.cdr.markForCheck();
        this.modalService.toggle({
            show: false,
            id: 'evcVServicesModal'
        });
    }

    public loadServicesForModal = (searchString: string) => {

        //Add current selected services of the select box also to selected list
        let selected: (string | number)[] = [];
        if (this.modalVService?.service_ids) {
            selected = this.modalVService.service_ids;
        }

        this.subscriptions.add(this.EventcorrelationsService.loadServices(searchString, this.id, selected).subscribe((services) => {
            this.modalServicesForSelect = this.reformatServicesForOptionGroupSelect(services);
            this.cdr.markForCheck();
        }));
    }

    /**
     * Reformat the services data provieded by the API (and EVC Tree JSON) to be compatible with the open group select component
     * @param services
     * @private
     */
    private reformatServicesForOptionGroupSelect(services: EvcServiceSelect[]): SelectItemOptionGroup[] {
        const result: SelectItemOptionGroup[] = [];

        // Group all services by host
        const servicesByHost = _.groupBy(services, 'value.Host.id');

        for (let hostId in servicesByHost) {
            let servicesOfHost = servicesByHost[hostId];

            if (servicesOfHost.length > 0) {

                // Create a new group for each host
                const host: SelectItemOptionGroup = {
                    label: servicesOfHost[0].value.Host.name,
                    value: hostId,
                    items: []
                };

                const items: SelectItem[] = [];
                servicesOfHost.forEach((service, index) => {
                    // Append all services to the host
                    let servicename = service.value.Service.servicename;
                    if (Number(service.value.Service.disabled) === 1) {
                        servicename += ' 🔌';
                    }

                    items.push({
                        label: servicename,
                        value: service.key
                    });
                });
                host.items = items;
                result.push(host);
            }
        }

        return result;
    }

    protected readonly EventcorrelationOperators = EventcorrelationOperators;
}
