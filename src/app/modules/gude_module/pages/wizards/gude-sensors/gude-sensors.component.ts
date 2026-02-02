import { ChangeDetectionStrategy, Component, inject, ViewChildren } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { GudeSensorsWizardService } from './gude-sensors-wizard.service';
import {
    GudeSensorsWizardGet,
    GudeSensorsWizardPost,
    InterfaceServicetemplate,
    SensorService
} from './gude-sensors-wizard.interface';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    AccordionButtonDirective,
    AccordionComponent,
    AccordionItemComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent,
    TemplateIdDirective
} from '@coreui/angular';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { OitcAlertComponent } from '../../../../../components/alert/alert.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { NgSelectComponent } from '@ng-select/ng-select';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';

@Component({
    selector: 'oitc-gude-sensors',
    imports: [
        RouterLink,
        FaIconComponent,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        TranslocoPipe,
        RequiredIconComponent,
        SelectComponent,
        FormLabelDirective,
        FormControlDirective,
        TranslocoDirective,
        OitcAlertComponent,
        ProgressBarModule,
        XsButtonDirective,
        CardTitleDirective,
        ColComponent,
        FormCheckInputDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        NgSelectComponent,
        RowComponent,
        BackButtonDirective,
        FormFeedbackComponent,
        FormErrorDirective,
        FormsModule,
        NgClass,
        FormCheckComponent,
        FormCheckLabelDirective,
        AccordionComponent,
        AccordionItemComponent,
        TemplateIdDirective,
        AccordionButtonDirective
    ],
    templateUrl: './gude-sensors.component.html',
    styleUrl: './gude-sensors.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GudeSensorsComponent extends WizardsAbstractComponent {
    @ViewChildren('accordionItem') accordionItems: AccordionItemComponent[] = [];
    protected override WizardService: GudeSensorsWizardService = inject(GudeSensorsWizardService);
    public checked: boolean = false;
    public accordionClosed: boolean = true;

    protected override post: GudeSensorsWizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
        sensorServices: [],
// Fields for the wizard
        authPassword: '',
        authProtocol: 'md5',
        sensors: [],
        privacyPassword: '',
        privacyProtocol: 'des',
        securityLevel: '1',
        securityName: '',
        snmpCommunity: '',
        snmpVersion: '2'
    } as GudeSensorsWizardPost;
    protected snmpVersions: SelectKeyValueString[] = [
        {value: '1', key: 'SNMP V 1'},
        {value: '2', key: 'SNMP V 2c'},
        {value: '3', key: 'SNMP V 3'},
    ]
    protected searchedTags: string[] = [];


    protected securityLevels: SelectKeyValueString[] = [
        {key: 'authPriv', value: '1'},
        {key: 'authNoPriv', value: '2'},
        {key: 'noAuthNoPriv', value: '3'},
    ];
    protected authProtocols: SelectKeyValueString[] = [
        {key: 'MD5', value: 'md5'},
        {key: 'SHA', value: 'sha'},
    ];
    protected privacyProtocols: SelectKeyValueString[] = [
        {key: 'DES', value: 'des'},
        {key: 'AES', value: 'aes'},
        {key: 'AES128', value: 'aes128'},
        {key: '3DES', value: '3des'},
        {key: '3DESDE', value: '3desde'},
    ];
    protected sensorsServicetemplateTemp: InterfaceServicetemplate = {} as InterfaceServicetemplate;
    protected sensorsServicetemplateHumidity: InterfaceServicetemplate = {} as InterfaceServicetemplate;

    protected override wizardLoad(result: GudeSensorsWizardGet): void {
        this.sensorsServicetemplateTemp = result.sensorsServicetemplateTemp;
        this.sensorsServicetemplateHumidity = result.sensorsServicetemplateHumidity;

        super.wizardLoad(result);
    }

    public override submit(): void {
        // let request = this.post; // Clone the original post object here!
        let request: GudeSensorsWizardPost = JSON.parse(JSON.stringify(this.post));

        // Remove all sensors from request where createService is false.
        request.sensorServices = request.sensorServices.filter(
            (sensorService: SensorService) => sensorService.createService && this.hasName(sensorService.name)
        );

        this.subscriptions.add(this.WizardService.submit(request)
            .subscribe((result: GenericResponseWrapper) => {
                this.errors = {} as GenericValidationError;
                if (result.success) {
                    const title: string = this.TranslocoService.translate('Success');
                    const msg: string = this.TranslocoService.translate('Data saved successfully');

                    this.notyService.genericSuccess(msg, title);
                    this.router.navigate(['/services/notMonitored']);
                    this.cdr.markForCheck();
                    return;
                }
                // Error
                this.notyService.genericError();
                this.notyService.scrollContentDivToTop();
                const errorResponse: GenericValidationError = result.data as GenericValidationError;
                if (result) {
                    this.errors = errorResponse;

                }
                this.cdr.markForCheck();
            })
        );
    }

    protected toggleCheck(checked: boolean): void {
        this.checked = checked;
        this.post.sensorServices.forEach((service: SensorService) => {
            if (!this.hasName(service.name)) {
                return;
            }
            service.createService = this.checked;
        });
        this.cdr.markForCheck();
    }

    protected toggleAccordionClose(checked: boolean): void {
        this.accordionClosed = checked;
        this.accordionItems.forEach((accordionItem: AccordionItemComponent) => {
            if ((accordionItem.visible && this.accordionClosed) || (!accordionItem.visible && !this.accordionClosed)) {
                accordionItem.toggleItem();
            }
        });
        this.cdr.markForCheck();
    }

    protected detectColor = function (label: string): string {
        if (label.match(/warning/gi)) {
            return 'warning';
        }

        if (label.match(/critical/gi)) {
            return 'critical';
        }

        return '';
    };

    protected hasName = (name: string): boolean => {
        if (this.searchedTags.length === 0) {
            return true;
        }
        return this.searchedTags.some((tag) => {
            return name.toLowerCase().includes(tag.toLowerCase());
        });
    }

    protected runGudeSensorsDiscovery(): void {
        this.post.sensorServices = [];
        this.beginDiscovery();
        this.cdr.markForCheck();
        this.WizardService.executeGudeSensorsDiscovery(this.post).subscribe((data: any) => {
            this.errors = {} as GenericValidationError;
            this.accordionClosed = true;
            this.cdr.markForCheck();
            // Error
            if (data && data.sensors && data.sensors.length && data.sensors[0].value && data.sensors[2]) {
                for (let key in data.sensors[2].value) {
                    let servicetemplatecommandargumentvaluesTemp = JSON.parse(JSON.stringify(this.sensorsServicetemplateTemp.servicetemplatecommandargumentvalues));
                    let servicetemplatecommandargumentvaluesHumidity = JSON.parse(JSON.stringify(this.sensorsServicetemplateHumidity.servicetemplatecommandargumentvalues));
                    servicetemplatecommandargumentvaluesTemp[3].value = data.sensors[2].value[key].name;
                    servicetemplatecommandargumentvaluesHumidity[3].value = data.sensors[2].value[key].name;
                    let tempSensorName = "Temperature " + String(data.sensors[2].value[key].name);
                    let humiditySensorName = "Humidity " + String(data.sensors[2].value[key].name);
                    this.post.sensorServices.push(
                        {
                            createService: !this.isServiceAlreadyPresent(this.WizardGet.servicesNamesForExistCheck, tempSensorName),
                            description: '',
                            host_id: this.post.host_id,
                            name: tempSensorName,
                            servicecommandargumentvalues: servicetemplatecommandargumentvaluesTemp,
                            servicetemplate_id: this.sensorsServicetemplateTemp.id
                        });
                    this.post.sensorServices.push(
                        {
                            createService: !this.isServiceAlreadyPresent(this.WizardGet.servicesNamesForExistCheck, humiditySensorName),
                            description: '',
                            host_id: this.post.host_id,
                            name: humiditySensorName,
                            servicecommandargumentvalues: servicetemplatecommandargumentvaluesHumidity,
                            servicetemplate_id: this.sensorsServicetemplateHumidity.id
                        });
                }
                this.endDiscovery();
                this.cdr.markForCheck();
                return;
            }
            this.notyService.genericError();

            const errorResponse: GenericValidationError = data.data as GenericValidationError;
            if (data.data) {
                this.errors = errorResponse;
                if (this.errors.hasOwnProperty('snmpCommunity')) {
                    this.notyService.scrollContentDivToTop();
                }
            }
            this.endDiscovery();
            this.cdr.markForCheck();
        });
    }
}
