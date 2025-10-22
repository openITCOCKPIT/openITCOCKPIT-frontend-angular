import { ChangeDetectionStrategy, Component, inject, ViewChild, ViewChildren } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { CiscoWlcWizardService } from './cisco-wlc-wizard.service';
import { CiscoWlcWizardGet, CiscoWlcWizardPost, InterfaceServicetemplate, N0 } from './cisco-wlc-wizard.interface';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    AccordionItemComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormLabelDirective
} from '@coreui/angular';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { Service } from '../../../../../pages/wizards/wizards.interface';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';

@Component({
    selector: 'oitc-cisco-wlc',
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
        NgIf,
        WizardsDynamicfieldsComponent,
        TranslocoDirective,
        ProgressBarModule,
        CardTitleDirective,
        BackButtonDirective,
        FormFeedbackComponent,
        FormErrorDirective,
        FormsModule
    ],
    templateUrl: './cisco-wlc.component.html',
    styleUrl: './cisco-wlc.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CiscoWlcComponent extends WizardsAbstractComponent {
    @ViewChildren('accordionItem') accordionItems: AccordionItemComponent[] = [];
    @ViewChild(WizardsDynamicfieldsComponent) childComponentLocal!: WizardsDynamicfieldsComponent;
    protected override WizardService: CiscoWlcWizardService = inject(CiscoWlcWizardService);
    public checked: boolean = false;
    public accordionClosed: boolean = true;

    protected override post: CiscoWlcWizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
// Fields for the wizard
        authPassword: '',
        authProtocol: 'md5',
        interfaces: [],
        privacyPassword: '',
        privacyProtocol: 'des',
        securityLevel: '1',
        securityName: '',
        snmpCommunity: '',
        snmpVersion: '2'
    } as CiscoWlcWizardPost;
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
    protected interfaceServicetemplate: InterfaceServicetemplate = {} as InterfaceServicetemplate;

    protected override wizardLoad(result: CiscoWlcWizardGet): void {
        this.interfaceServicetemplate = result.interfaceServicetemplate;

        super.wizardLoad(result);
    }

    public override submit(): void {
        // let request = this.post; // Clone the original post object here!
        let request: CiscoWlcWizardPost = JSON.parse(JSON.stringify(this.post));

        // Remove all services from request where createService is false.
        request.services = request.services.filter((service: Service) => {
            return service.createService && this.childComponent.hasName(service.name);
        });
        // Remove all interfaces from request where createService is false.
        request.interfaces = [];

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
        this.post.interfaces.forEach((service: N0) => {
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

}
