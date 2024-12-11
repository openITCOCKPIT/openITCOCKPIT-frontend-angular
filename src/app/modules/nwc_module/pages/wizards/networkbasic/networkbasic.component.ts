import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { NetworkbasicWizardService } from './networkbasic-wizard.service';
import { NetworkbasicWizardGet, NetworkbasicWizardPost } from './networkbasic-wizard.interface';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
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

@Component({
    selector: 'oitc-networkbasic',
    standalone: true,
    imports: [
        RouterLink,
        FaIconComponent,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        TranslocoPipe,
        RequiredIconComponent,
        SelectComponent,
        FormFeedbackComponent,
        FormErrorDirective,
        FormLabelDirective,
        FormControlDirective,
        FormsModule,
        NgIf,
        WizardsDynamicfieldsComponent,
        TranslocoDirective
    ],
    templateUrl: './networkbasic.component.html',
    styleUrl: './networkbasic.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkbasicComponent extends WizardsAbstractComponent {
    protected override WizardService: NetworkbasicWizardService = inject(NetworkbasicWizardService);

    protected override post: NetworkbasicWizardPost = {
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
    } as NetworkbasicWizardPost;
    protected snmpVersions: SelectKeyValueString[] = [
        {value: '1', key: 'SNMP V 1'},
        {value: '2', key: 'SNMP V 2c'},
        {value: '3', key: 'SNMP V 3'},
    ]
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

}
