import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    EvcAddVServiceValidationResult,
    EvcDeleteNode,
    EvcDeleteNodeDetails,
    EvcEditVServiceValidationResult,
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
    BadgeComponent,
    ButtonCloseDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormControlDirective,
    FormLabelDirective,
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
    RowComponent,
    TextColorDirective
} from '@coreui/angular';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { EvcTreeEditComponent } from './evc-tree-edit/evc-tree-edit.component';
import {
    SelectItem,
    SelectItemOptionGroup,
    SelectKeyValue,
    SelectKeyValueString
} from '../../../../../layouts/primeng/select.interface';
import { EventcorrelationOperators } from '../eventcorrelations.enum';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { PaginatorModule } from 'primeng/paginator';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { GenericSuccessResponse, GenericValidationError } from '../../../../../generic-responses';


import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import {
    MultiSelectOptgroupComponent
} from '../../../../../layouts/primeng/multi-select/multi-select-optgroup/multi-select-optgroup.component';
import _ from 'lodash';
import { HttpErrorResponse } from '@angular/common/http';
import { EvcTreeValidationErrors } from '../eventcorrelations-view/evc-tree/evc-tree.interface';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { FormsModule } from '@angular/forms';
import { ScoreThresholdsComponent } from '../../../components/score-thresholds/score-thresholds.component';
import { NgClass } from '@angular/common';

@Component({
    selector: 'oitc-eventcorrelations-edit-correlation',
    imports: [
        BackButtonDirective,
        BlockLoaderComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        RowComponent,
        TranslocoDirective,
        XsButtonDirective,
        EvcTreeEditComponent,
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
        PaginatorModule,
        RequiredIconComponent,
        SelectComponent,
        MultiSelectOptgroupComponent,
        BadgeComponent,
        FormsModule,
        TextColorDirective,
        ScoreThresholdsComponent,
        InputGroupTextDirective,
        TranslocoPipe,
        NgClass
    ],
    templateUrl: './eventcorrelations-edit-correlation.component.html',
    styleUrl: './eventcorrelations-edit-correlation.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventcorrelationsEditCorrelationComponent implements OnInit, OnDestroy {
    private readonly TranslocoService = inject(TranslocoService);

    public isLoading: boolean = true;
    public id: number = 0;

    public evcTree: EvcTree[] = [];
    public rootElement?: EventcorrelationRootElement;
    public servicetemplates: SelectKeyValue[] = [];

    public showInfoForDisabledService: number = 0;
    public disabledServices: number = 0; //number of disabled services in the EVC
    public stateForDisabledService: number = 3; // Unknown

    public downtimedServices: number = 0; //number of services in a downtime in the EVC
    public stateForDowntimedService: number = 3; // Unknown

    public animated: number = 0; // not animated
    public connectionLine: string = 'bezier'; // bezier, straight, segment

    public layerWithErrors: EvcTreeValidationErrors = {};
    public evcNodeWithErrors: EvcTreeValidationErrors = {};

    /** EVC Service Modal variables */
    public modalCurrentLayerIndex: number = 0;
    public modalVService?: EvcModalService;
    public modalServicesForSelect: SelectItemOptionGroup[] = [];
    public showSpinner: boolean = false;
    protected readonly EventcorrelationOperators = EventcorrelationOperators;

    public modalOperators: SelectKeyValueString[] = [
        {key: EventcorrelationOperators.AND, value: this.TranslocoService.translate('AND')},
        {key: EventcorrelationOperators.OR, value: this.TranslocoService.translate('OR')},
        {key: EventcorrelationOperators.EQ, value: this.TranslocoService.translate('EQUAL')},
        {key: EventcorrelationOperators.MIN, value: this.TranslocoService.translate('MIN')},
        {
            key: EventcorrelationOperators.SCORESCLALARGREATER,
            value: this.TranslocoService.translate('SCORE scalar >= (greater-or-equal)')
        },
        {
            key: EventcorrelationOperators.SCORESCLALARLESSER,
            value: this.TranslocoService.translate('SCORE scalar <= (lesser-or-equal)')
        },
        {
            key: EventcorrelationOperators.SCORERANGEINCLUSIVE,
            value: this.TranslocoService.translate('SCORE Range Inclusive (≥ 10 and ≤ 20 - inside the range of 10 to 20)')
        },
        {
            key: EventcorrelationOperators.SCORERANGEEXCLUSIVE,
            value: this.TranslocoService.translate('SCORE Range Exclusive (< 10 or > 20 - outside the range of 10 to 20)')
        }
    ];
    public errors: GenericValidationError | null = null;

    public highlightHostId: number = 0;
    public highlightServiceId: number = 0;

    public hasUnsavedChanges: boolean = false;

    private subscriptions: Subscription = new Subscription();
    private readonly EventcorrelationsService = inject(EventcorrelationsService);
    private readonly modalService: ModalService = inject(ModalService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);
    private readonly notyService = inject(NotyService);

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.id = Number(this.route.snapshot.paramMap.get('id'));

            // Query String Parameters
            const highlightHostId = Number(params['highlightHostId']) || 0;
            if (highlightHostId > 0) {
                this.highlightHostId = highlightHostId;
            }

            const highlightServiceId = Number(params['highlightServiceId']) || 0;
            if (highlightServiceId > 0) {
                this.highlightServiceId = highlightServiceId;
            }

            this.loadEventcorrelation();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadEventcorrelation() {
        this.isLoading = true;
        this.cdr.markForCheck();

        this.subscriptions.add(this.EventcorrelationsService.getEventcorrelationEditCorrelation(this.id).subscribe((result) => {
            this.cdr.markForCheck();

            this.evcTree = result.evcTree;
            this.hasUnsavedChanges = false;
            this.rootElement = result.rootElement;
            this.servicetemplates = result.servicetemplates;
            this.showInfoForDisabledService = result.showInfoForDisabledService;
            this.stateForDisabledService = result.stateForDisabledService;
            this.animated = result.animated;
            this.connectionLine = result.connectionLine;
            this.disabledServices = result.disabledServices;

            this.downtimedServices = result.downtimedServices;
            this.stateForDowntimedService = result.stateForDowntimedService;

            this.isLoading = false;
        }));
    }

    public showAddVServiceModal(layerIndex: number): void {
        this.errors = null; // reset previous errors
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
            this.modalServicesForSelect = [];

            const services = this.getServicesByLayerIndexForSelect(layerIndex);
            this.modalServicesForSelect = this.reformatServicesForOptionGroupSelect(services);

            this.cdr.markForCheck();
        }

        this.modalService.toggle({
            show: true,
            id: 'evcVServicesModal'
        });
    }

    public showEditVServiceModal(layerIndex: number, eventCorrelation: EvcTreeItem) {
        this.errors = null; // reset previous errors
        this.modalCurrentLayerIndex = layerIndex - 1;
        let layerIndexToLoadServicesFrom = layerIndex - 1;

        const operator = this.getParsedOperator(eventCorrelation.operator);
        this.modalVService = {
            servicename: String(eventCorrelation.service.name),
            servicetemplate_id: eventCorrelation.service.servicetemplate_id,
            service_ids: this.getServicesIdsByLayerIndexAndParentId(layerIndexToLoadServicesFrom, eventCorrelation.id),
            operator: operator.operator,
            operator_modifier: operator.modifier,
            operator_warning_min: operator.operator_warning_min,
            operator_warning_max: operator.operator_warning_max,
            operator_critical_min: operator.operator_critical_min,
            operator_critical_max: operator.operator_critical_max,
            operator_unknown_min: operator.operator_unknown_min,
            operator_unknown_max: operator.operator_unknown_max,
            score_warning: operator.score_warning,
            score_critical: operator.score_critical,
            score_unknown: operator.score_unknown,
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
    private getServicesIdsByLayerIndex(layerIndex: number): (number | string)[] {
        const layerServices = this.getServicesByLayerIndex(layerIndex);
        const layerServicesIds: (number | string)[] = [];

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
    private getServicesByLayerIndexForSelect(layerIndex: number | string, currentEvcId?: string | number | undefined): EvcServiceSelect[] {
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
    private getServicesIdsByLayerIndexAndParentId(layerIndex: number, parentId: string | number): (number | string)[] {
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
        operator: EventcorrelationOperators | null,
        modifier: number,
        operator_warning_min: null,
        operator_warning_max: null,
        operator_critical_min: null,
        operator_critical_max: null,
        operator_unknown_min: null,
        operator_unknown_max: null,
        score_warning: null,
        score_critical: null,
        score_unknown: null,

    } {

        if (operatorString === null) {
            return {
                operator: null,
                modifier: 0,
                operator_warning_min: null,
                operator_warning_max: null,
                operator_critical_min: null,
                operator_critical_max: null,
                operator_unknown_min: null,
                operator_unknown_max: null,
                score_warning: null,
                score_critical: null,
                score_unknown: null
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
                    modifier: parseInt(operatorString.substring(3), 10),
                    operator_warning_min: null,
                    operator_warning_max: null,
                    operator_critical_min: null,
                    operator_critical_max: null,
                    operator_unknown_min: null,
                    operator_unknown_max: null,
                    score_warning: null,
                    score_critical: null,
                    score_unknown: null,
                };

            default:
                //AND, OR, EQ
                return {
                    operator: operatorString as EventcorrelationOperators,
                    modifier: 0,
                    operator_warning_min: null,
                    operator_warning_max: null,
                    operator_critical_min: null,
                    operator_critical_max: null,
                    operator_unknown_min: null,
                    operator_unknown_max: null,
                    score_warning: null,
                    score_critical: null,
                    score_unknown: null,
                };
        }
    }

    private getOperatorString(operator: EventcorrelationOperators | null, modifier: number): null | string {
        if (!operator) {
            return null;
        }

        switch (operator) {
            case EventcorrelationOperators.MIN:
                //min1, min 10, min300
                return 'min' + modifier;
            default:
                //AND, OR, EQ
                return operator;
        }
    }

    public onToggleVServiceModal(event: EvcToggleModal) {
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
                servicesOfHost.forEach((service) => {
                    // Append all services to the host
                    let servicename = service.value.Host.name + '/' + service.value.Service.servicename;
                    if (Number(service.value.Service.disabled) === 1) {
                        servicename += ' 🔌';
                    }

                    items.push({
                        label: servicename,
                        value: service.key,
                        disabled: service.vServiceInUse === true
                    });
                });
                host.items = items;
                result.push(host);
            }
        }

        return result;
    }

    public validateModalForm() {
        if (this.modalVService?.current_evc.mode === 'add') {
            this.validateModalAddVServices();
        }

        if (this.modalVService?.current_evc.mode === 'edit') {
            this.validateModalEditVServices();
        }
    }

    /**
     * add new services
     * @private
     */
    private validateModalAddVServices(): void {
        this.errors = null;
        if (!this.modalVService) {
            return;
        }

        this.showSpinner = true;
        this.cdr.markForCheck();

        const sub = this.EventcorrelationsService.validateModalAddVServices(this.modalVService).subscribe({
            next: (value: any) => {
                //console.log(value); // Serve result with the new copied host templates
                // 200 ok
                const result = value as EvcAddVServiceValidationResult;
                const updates = result.updates;

                for (const layerIndexToUpdate in updates) {
                    const layerIndexToUpdateInt = Number(layerIndexToUpdate);

                    if (typeof this.evcTree[layerIndexToUpdateInt] === "undefined") {
                        //Create new layer in evcTree
                        this.evcTree[layerIndexToUpdateInt] = {};
                    }

                    if (layerIndexToUpdate === "0") { //this is a json object {} so we get strings !!!
                        //Add new 1st layer services
                        for (const newParentId in updates[layerIndexToUpdate]) {

                            //Add new 1st layer services to evcTree as array
                            this.evcTree[layerIndexToUpdateInt][newParentId] = [];

                            for (const jsonKey in updates[layerIndexToUpdate][newParentId]) {
                                this.evcTree[layerIndexToUpdateInt][newParentId].push(updates[layerIndexToUpdate][newParentId][jsonKey]);
                            }
                        }
                    }

                    //Add new vServices (this can always be only one service !)
                    if (layerIndexToUpdateInt > 0) {

                        for (const newParentIdvService in updates[layerIndexToUpdate]) {

                            //Add new vService to evcTree as array
                            this.evcTree[layerIndexToUpdateInt][newParentIdvService] = [];

                            //The new vService has always the key "0" !
                            updates[layerIndexToUpdate][newParentIdvService]["0"].usedBy = []; //This needs to be an array but PHP's JSON_FORCE_OBJECT force this into an {} object
                            this.evcTree[layerIndexToUpdateInt][newParentIdvService].push(updates[layerIndexToUpdate][newParentIdvService]["0"]);

                            const newParentIdWithoutvServiceSuffix = updates[layerIndexToUpdate][newParentIdvService]["0"].id;

                            //Update old vServices with the new parentId (NO _vService prefix!)
                            //Only update if we do not add any 1st layer services.
                            //If we have any 1st layer services, the service handles all that for us.
                            if (updates.hasOwnProperty("0") === false) {
                                if (this.modalVService?.current_evc.layerIndex) {

                                    //Create new evc "container" with new parent id as key (no _vService suffix)
                                    this.evcTree[this.modalVService.current_evc.layerIndex][newParentIdWithoutvServiceSuffix] = [];

                                    for (const index in this.modalVService.service_ids) {

                                        //Get old parentLess node
                                        const oldKeyToUpdate = this.modalVService.service_ids[index];
                                        const evcNodeToUpdateArray = this.evcTree[this.modalVService.current_evc.layerIndex][oldKeyToUpdate];

                                        //Remove old and parent less evcNode
                                        delete this.evcTree[this.modalVService.current_evc.layerIndex][oldKeyToUpdate];

                                        for (const evcIndex in evcNodeToUpdateArray) {
                                            const evcNodeToUpdate = evcNodeToUpdateArray[evcIndex];
                                            evcNodeToUpdate.parent_id = newParentIdWithoutvServiceSuffix;

                                            this.evcTree[this.modalVService.current_evc.layerIndex][newParentIdWithoutvServiceSuffix].push(evcNodeToUpdate);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Important for the Angular Change Detection
                // Signals Need to be Immutable
                // https://www.angulararchitects.io/blog/angular-signals/
                // evcTree is now a new object, so the reference changes
                // do not use _.cloneDeep() as it reverses the evcTree for some reason
                this.evcTree = [...this.evcTree];

                this.modalService.toggle({
                    show: false,
                    id: 'evcVServicesModal'
                });
                this.showSpinner = false;

                // Mark the EVC as changed
                this.hasUnsavedChanges = true;

                // All done trigger change detection
                this.cdr.markForCheck();
            },
            error: (error: HttpErrorResponse) => {
                // We run into a validation error.
                this.errors = error.error.error as GenericValidationError;
                this.showSpinner = false;

                this.cdr.markForCheck();
            }
        });

        this.subscriptions.add(sub);

    }

    private validateModalEditVServices(): void {
        this.errors = null;
        if (!this.modalVService || !this.modalVService.current_evc) {
            return;
        }

        this.showSpinner = true;
        this.cdr.markForCheck();

        const sub = this.EventcorrelationsService.validateModalEditVServices(this.modalVService).subscribe({
            next: (value: any) => {
                //console.log(value); // Serve result with the new copied host templates
                // 200 ok

                if (!this.modalVService || !this.modalVService.current_evc) {
                    return;
                }

                const result = value as EvcEditVServiceValidationResult;

                //Update parent service (operator string, servicetemplate_id, service name)
                let evcNode: null | EvcTreeItem = null;

                find_evc_node:
                    for (let services in this.evcTree[this.modalVService.current_evc.layerIndex]) {
                        for (let eventCorrelation in this.evcTree[this.modalVService.current_evc.layerIndex][services]) {
                            evcNode = this.evcTree[this.modalVService.current_evc.layerIndex][services][eventCorrelation];

                            //Find the vService node that was edited
                            if (evcNode.id === this.modalVService.current_evc.evc_node_id) {
                                this.evcTree[this.modalVService.current_evc.layerIndex][services][eventCorrelation].operator = this.getOperatorString(this.modalVService.operator, this.modalVService.operator_modifier);
                                this.evcTree[this.modalVService.current_evc.layerIndex][services][eventCorrelation].service.servicename = this.modalVService.servicename;
                                this.evcTree[this.modalVService.current_evc.layerIndex][services][eventCorrelation].service.name = this.modalVService.servicename;
                                this.evcTree[this.modalVService.current_evc.layerIndex][services][eventCorrelation].service.servicetemplate_id = this.modalVService.servicetemplate_id;

                                break find_evc_node;
                            }
                        }
                    }

                if (evcNode === null) {
                    this.notyService.genericError(this.TranslocoService.translate('Error: Could not find parent node!'));
                    return;
                }

                if (this.modalVService.current_evc.layerIndex === 1) {
                    //Server returned all 1st layer services - simply replace the old services in the json with the new one
                    //layerIndexToUpdate = 0;
                    if (typeof this.evcTree[0][evcNode.id] !== "undefined") {
                        this.evcTree[0][evcNode.id] = result.services;
                    }
                }

                if (this.modalVService.current_evc.layerIndex > 1) {
                    if (!this.modalVService.current_evc.old_service_ids) {
                        this.modalVService.current_evc.old_service_ids = [];
                    }

                    let servicesToAdd = _.difference(this.modalVService.service_ids, this.modalVService.current_evc.old_service_ids);
                    let servicesToDelete = _.difference(this.modalVService.current_evc.old_service_ids, this.modalVService.service_ids);
                    let previousLayerIndex = this.modalVService.current_evc.layerIndex - 1;

                    if (!_.isEmpty(servicesToAdd)) {
                        for (let i in servicesToAdd) {
                            // servicesToAdd can only contain vServices where parent_id === null
                            // so the jsonKey has an _vService suffix.

                            let jsonKey = servicesToAdd[i];
                            let evcNodeToAdd = this.evcTree[previousLayerIndex][jsonKey][0];

                            //Delete old node
                            delete this.evcTree[previousLayerIndex][jsonKey];

                            //Move evd node to new parent
                            evcNodeToAdd.parent_id = evcNode.id;

                            this.evcTree[previousLayerIndex][evcNode.id].push(evcNodeToAdd);
                        }
                    }

                    if (!_.isEmpty(servicesToDelete)) {
                        let evcsToKeep: EvcTreeItem[] = [];
                        for (let index in this.evcTree[previousLayerIndex][evcNode.id]) {
                            // The value of the select box has the _vService suffix!

                            let idToCheck = this.evcTree[previousLayerIndex][evcNode.id][index].id + '_vService';
                            if (!servicesToDelete.some(item => item == idToCheck)) {
                                //Keep this service in current evc node
                                evcsToKeep.push(this.evcTree[previousLayerIndex][evcNode.id][index]);
                            } else {
                                //This service got removed from current evc node
                                //Set parent_id to null and create new _vService record in json.

                                let evcServiceToMove = this.evcTree[previousLayerIndex][evcNode.id][index];

                                let vServiceJsonKey = evcServiceToMove.id + '_vService';
                                evcServiceToMove.parent_id = null;

                                this.evcTree[previousLayerIndex][vServiceJsonKey] = [
                                    evcServiceToMove
                                ];
                            }
                        }

                        this.evcTree[previousLayerIndex][evcNode.id] = evcsToKeep;
                    }
                }


                // Important for the Angular Change Detection
                // Signals Need to be Immutable
                // https://www.angulararchitects.io/blog/angular-signals/
                // evcTree is now a new object, so the reference changes
                // do not use _.cloneDeep() as it reverses the evcTree for some reason
                this.evcTree = [...this.evcTree];

                this.modalService.toggle({
                    show: false,
                    id: 'evcVServicesModal'
                });
                this.showSpinner = false;

                // Mark the EVC as changed
                this.hasUnsavedChanges = true;

                // All done trigger change detection
                this.cdr.markForCheck();
            },
            error: (error: HttpErrorResponse) => {
                // We run into a validation error.
                this.errors = error.error.error as GenericValidationError;
                this.showSpinner = false;

                this.cdr.markForCheck();
            }
        });

        this.subscriptions.add(sub);

    }

    private validateEvcTreeBeforeSave(): boolean {
        const layerWithErrors: EvcTreeValidationErrors = {};
        const evcNodeWithErrors: EvcTreeValidationErrors = {};
        const lastLayerIndex = this.evcTree.length - 1;

        let layerHasErrors: boolean = false;

        this.evcTree.forEach((evcLayer, layerIndex) => {
            layerHasErrors = false;

            for (const vServiceId in evcLayer) {
                for (const evcTreeItem of evcLayer[vServiceId]) {

                    // Check all layers for a parent service - except the last layer
                    if (evcTreeItem.parent_id === null && layerIndex !== lastLayerIndex) {
                        layerHasErrors = true;
                        evcNodeWithErrors[evcTreeItem.id] = true;
                    }

                    // Check the last layer - only allow one element with parent_id = null!
                    if (layerIndex === lastLayerIndex) {
                        if (Object.keys(this.evcTree[layerIndex]).length > 1) {
                            layerHasErrors = true;
                            evcNodeWithErrors[evcTreeItem.id] = true;
                        }
                    }
                }
            }

            if (layerHasErrors) {
                layerWithErrors[layerIndex] = true;
            }
        });

        this.layerWithErrors = layerWithErrors;
        this.evcNodeWithErrors = evcNodeWithErrors;

        if (Object.keys(layerWithErrors).length > 0) {
            return false;
        }

        if (Object.keys(evcNodeWithErrors).length > 0) {
            return false;
        }

        return true;
    }

    public saveEventcorrelation() {
        const result = this.validateEvcTreeBeforeSave();

        this.cdr.markForCheck();

        if (!result) {
            this.notyService.genericError();
            return;
        }
        console.log(this.evcTree);
        return;
        this.subscriptions.add(this.EventcorrelationsService.saveCorrelation(this.id, this.evcTree)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {

                    const response = result.data as GenericSuccessResponse;

                    const title = this.TranslocoService.translate('Event Correlation');
                    const msg = this.TranslocoService.translate('saved successfully');
                    const url = ['eventcorrelation_module', 'eventcorrelations', 'editCorrelation', this.id];


                    this.notyService.genericSuccess(msg, title, url);
                    this.notyService.scrollContentDivToTop();

                    this.router.navigate(['/eventcorrelation_module/eventcorrelations/index']);

                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
            }));


    }

    public onDeleteEvcNode(event: EvcDeleteNode) {
        this.deleteEvcNode(event.layerIndex, event.evcNodeId);
        this.checkForMissingParents();

        // Mark the EVC as changed
        this.hasUnsavedChanges = true;

        // Create a new reference for Angular Signals
        this.evcTree = [...this.evcTree];

        this.cdr.markForCheck();
    }

    /**
     * Find a node inside evcTree by its id
     * If the node was found, the parent_id and the serviceIndex will be returned
     *
     * Otherwise, the parent_id and serviceIndex will be null - Basically this can never happen, as this method gets called
     * in an onClick event, if the user can click on the node, the node must exist
     *
     * @param layerIndex
     * @param evcNodeId
     * @private
     */
    private findEvcNodeInTreeForDelete(layerIndex: number, evcNodeId: string | number): EvcDeleteNodeDetails {
        evcNodeId = String(evcNodeId);

        let nodeDetails: EvcDeleteNodeDetails = {
            id: evcNodeId,        // id of the node we are looking for in evcTree
            parent_id: null,      // parent if of our node - null if the last one (or unfinished EVC)
            serviceIndex: null,   // our own position in the array
            parentEvcId: null,    // ParentId from the evcTree. E.g. 60_vService if we have no parent (or unfinished EVC)
        };

        for (let parentEvcId in this.evcTree[layerIndex]) {
            nodeDetails.parentEvcId = parentEvcId;

            for (let k in this.evcTree[layerIndex][parentEvcId]) {
                //Find the evcNode by the given id
                if (this.evcTree[layerIndex][parentEvcId][k].id == evcNodeId) {
                    // parent exists
                    if (this.evcTree[layerIndex][parentEvcId][k].parent_id !== null) {
                        nodeDetails.parent_id = String(this.evcTree[layerIndex][parentEvcId][k].parent_id); // our own parent
                    }
                    nodeDetails.serviceIndex = Number(k); // our own position in the array
                    return nodeDetails;
                }
            }
        }

        // No parent found
        // technically this should never happen
        return nodeDetails;
    }

    /**
     * Remove one vService from the evcTree and also remove the parent vService if no more vServices
     * where attached to the parent vService
     *
     * @param layerIndex
     * @param evcNodeId
     * @private
     */
    private deleteEvcNode(layerIndex: number, evcNodeId: string | number) {

        // find the parent id in evcTree
        const nodeDetails = this.findEvcNodeInTreeForDelete(layerIndex, evcNodeId);
        this.cdr.markForCheck();
        //delete real services from 1st layer in evcTree
        if (layerIndex === 1) {
            delete this.evcTree[0][evcNodeId];
            if (_.isEmpty(this.evcTree[0])) {
                // EVC is now empty
                this.evcTree = [];
                return;
            }
        }

        if (nodeDetails.parentEvcId !== null) {
            if (_.size(this.evcTree[layerIndex][nodeDetails.parentEvcId]) === 1) {
                // delete layer with number if only single element exists(data type object {})
                delete this.evcTree[layerIndex][nodeDetails.parentEvcId];

                //Remove layer and all PARENT layers to the left, because this layer is empty now!
                if (_.isEmpty(this.evcTree[layerIndex])) {

                    const amountOfLayersToDelete = this.evcTree.length - layerIndex;
                    this.evcTree.splice(layerIndex, amountOfLayersToDelete);

                    //Cleanup done - no parents to delete anymore
                    return;
                }

            } else {
                //remove element with id if layer consists more items than one (data type array [])
                if (nodeDetails.serviceIndex !== null) {
                    this.evcTree[layerIndex][nodeDetails.parentEvcId].splice(nodeDetails.serviceIndex, 1);
                }

                //return, clean up done, all affected elements has been removed
                return;
            }
        }

        //Delete vServices to the right
        if (nodeDetails.parent_id !== null) {
            this.deleteEvcNode(layerIndex + 1, nodeDetails.parent_id);
        }
    }

    private checkForMissingParents() {
        for (let layerIndex in this.evcTree) {
            for (let parentEvcId in this.evcTree[layerIndex]) {

                //Check if this parent exists
                let parentExists = false;
                let evcLayerToCheck = parseInt(layerIndex, 10) + 1;
                if (typeof this.evcTree[evcLayerToCheck] != 'undefined') {
                    for (let parentEvcIdToCheck in this.evcTree[evcLayerToCheck]) {
                        for (let k in this.evcTree[evcLayerToCheck][parentEvcIdToCheck]) {
                            if (String(this.evcTree[evcLayerToCheck][parentEvcIdToCheck][k].id) === String(parentEvcId)) {
                                parentExists = true;
                                break;
                            }
                        }
                        if (parentExists === true) {
                            break;
                        }
                    }
                }
                if (parentExists === false) {
                    let container = this.evcTree[layerIndex][parentEvcId];
                    //resolve original event correlation for processing
                    delete this.evcTree[layerIndex][parentEvcId];
                    for (let evcService in container) {
                        container[evcService].parent_id = null;
                        // for example: Layer 1{1} with oldKey => 60 [2 Elements with parent_id = 60]
                        // after delete node with id 60
                        // Layer 1{2} with keys =>  61_vService[1] and 66_vService[1] and parent_id = null
                        let key = container[evcService].id + '_vService';
                        this.evcTree[layerIndex][key] = [];
                        this.evcTree[layerIndex][key].push(container[evcService]);
                    }
                }
            }
        }
    }

    public updateServiceScores = () => {
        if (!this.modalVService) {
            return;
        }
        if (!this.modalVService.operator) {
            return;
        }
        if (![EventcorrelationOperators.SCORESCLALARGREATER,
            EventcorrelationOperators.SCORESCLALARLESSER,
            EventcorrelationOperators.SCORERANGEINCLUSIVE,
            EventcorrelationOperators.SCORERANGEINCLUSIVE].includes(this.modalVService.operator)) {
            return;
        }

        if (this.evcTree[this.modalVService.current_evc.layerIndex - 1] && this.modalVService.current_evc.evc_node_id) {
            console.log(this.evcTree[this.modalVService.current_evc.layerIndex - 1]);
            console.log(this.evcTree[this.modalVService.current_evc.layerIndex - 1][this.modalVService.current_evc.evc_node_id])
        }
        //console.log(this.modalVService.current_evc.layerIndex);
        //console.log(this.evcTree);
        if (this.modalVService.service_ids) {
            console.log('CHANGES HERERERERRE !!!');
            //console.log(this.modalVService.service_ids);
            //console.log(this.modalVService);
        }
    }
}
