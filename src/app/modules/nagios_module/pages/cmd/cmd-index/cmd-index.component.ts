import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    AcknowledgementIconComponent
} from '../../../../../pages/acknowledgements/acknowledgement-icon/acknowledgement-icon.component';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
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
    DropdownComponent,
    DropdownDividerDirective,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
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
import { CopyToClipboardComponent } from '../../../../../layouts/coreui/copy-to-clipboard/copy-to-clipboard.component';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { DisableModalComponent } from '../../../../../layouts/coreui/disable-modal/disable-modal.component';
import { DowntimeIconComponent } from '../../../../../pages/downtimes/downtime-icon/downtime-icon.component';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    HostAcknowledgeModalComponent
} from '../../../../../components/hosts/host-acknowledge-modal/host-acknowledge-modal.component';
import {
    HostsDisableNotificationsModalComponent
} from '../../../../../components/hosts/hosts-disable-notifications-modal/hosts-disable-notifications-modal.component';
import {
    HostsEnableNotificationsModalComponent
} from '../../../../../components/hosts/hosts-enable-notifications-modal/hosts-enable-notifications-modal.component';
import {
    HostsMaintenanceModalComponent
} from '../../../../../components/hosts/hosts-maintenance-modal/hosts-maintenance-modal.component';
import { HoststatusIconComponent } from '../../../../../pages/hosts/hoststatus-icon/hoststatus-icon.component';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import {
    QueryHandlerCheckerComponent
} from '../../../../../layouts/coreui/query-handler-checker/query-handler-checker.component';
import {
    RegexHelperTooltipComponent
} from '../../../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import {
    ServiceResetChecktimeModalComponent
} from '../../../../../components/services/service-reset-checktime-modal/service-reset-checktime-modal.component';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { TrustAsHtmlPipe } from '../../../../../pipes/trust-as-html.pipe';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExternalCommandsService } from '../../../../../services/external-commands.service';
import { ExternalCommandDefinition, ExternalCommandDefinitionRoot } from '../ExternalCommands.interface';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { ApikeyDocModalComponent } from '../../../../../layouts/coreui/apikey-doc-modal/apikey-doc-modal.component';

@Component({
    selector: 'oitc-cmd-index',
    standalone: true,
    imports: [
        AcknowledgementIconComponent,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        CopyToClipboardComponent,

        DebounceDirective,
        DeleteAllModalComponent,
        DisableModalComponent,
        DowntimeIconComponent,
        DropdownComponent,
        DropdownDividerDirective,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
        FaIconComponent,
        FaStackComponent,
        FaStackItemSizeDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        HostAcknowledgeModalComponent,
        HostsDisableNotificationsModalComponent,
        HostsEnableNotificationsModalComponent,
        HostsMaintenanceModalComponent,
        HoststatusIconComponent,
        InputGroupComponent,
        InputGroupTextDirective,
        ItemSelectComponent,
        MatSort,
        MatSortHeader,
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NgSelectModule,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        PermissionDirective,
        QueryHandlerCheckerComponent,
        ReactiveFormsModule,
        RegexHelperTooltipComponent,
        RowComponent,
        SelectAllComponent,
        ServiceResetChecktimeModalComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoDirective,
        TranslocoPipe,
        TrueFalseDirective,
        TrustAsHtmlPipe,
        XsButtonDirective,
        RouterLink,
        AlertComponent,
        AlertHeadingDirective,
        FormErrorDirective,
        FormLabelDirective,
        RequiredIconComponent,
        SelectComponent,
        KeyValuePipe,
        ApikeyDocModalComponent
    ],
    templateUrl: './cmd-index.component.html',
    styleUrl: './cmd-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CmdIndexComponent implements OnInit, OnDestroy {

    public selectedCommandIndex: number = 0;
    public externalCommands: SelectKeyValue[] = [];

    // Currently selected command with parameters and request strings
    public currentCommandName: string = '';
    public currentCommandParams?: ExternalCommandDefinition = {};
    public currentCommandAsGetRequest: string = '';
    public currentCommandAsPostRequest: string = '';
    public currentCommandForNaemonIoDocs: string = '';

    private readonly ExternalCommandsService: ExternalCommandsService = inject(ExternalCommandsService);
    private readonly TranslocoService = inject(TranslocoService);

    private subscriptions: Subscription = new Subscription();

    private externalCommandsResult: ExternalCommandDefinitionRoot = {};

    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {

        this.subscriptions.add(this.ExternalCommandsService.getExternalCommandsWithParams()
            .subscribe((result) => {
                this.externalCommandsResult = result;

                // For some reason this line is very important.
                // Otherwise, the select box will not display the selected value (╯‵□′)╯︵┻━┻
                this.externalCommands = [];

                Object.keys(this.externalCommandsResult).forEach((commandName, index) => {
                    this.externalCommands.push({
                        key: index,
                        value: commandName
                    });
                });

                // Trigger the change event to display the first command
                this.onCommandChange();
                this.cdr.markForCheck();
            })
        );
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public onCommandChange() {
        // Find the selected command
        const command = this.externalCommands[this.selectedCommandIndex];
        const commandName = command.value;

        // Get the command parameters from the original server result using the command name as key
        const commandParams = this.externalCommandsResult[commandName];
        //console.log(commandParams);

        let urlParams: any[] = [];
        let postJson: any = {
            command: commandName
        };
        if (Array.isArray(commandParams)) {
            // php json encodes empty objects as array [].
            // So we know when we got an array, this command has no parameters.
            this.currentCommandParams = undefined;
        } else {
            // We have an object {} so we have parameters.
            this.currentCommandParams = commandParams;
            for (let key in commandParams) {
                const paramName = key;
                const paramValue = commandParams[key];

                if (paramValue === null) {
                    // This param is required and has no default value
                    urlParams.push(`${paramName}=<${paramName}>`); // hostUuid=<hostUuid>
                    postJson[paramName] = `<${paramName}>`;
                } else {
                    // This param has a default value
                    urlParams.push(`${paramName}=${paramValue}`); // sticky=0
                    postJson[paramName] = paramValue;
                }
            }
        }

        // Generate the GET request string
        let destination = 'submit';
        if (commandName === 'ACKNOWLEDGE_OTRS_HOST_SVC_PROBLEM') {
            destination = 'ack';
        }

        const API_KEY_TRANSLATION = this.TranslocoService.translate('YOUR_API_KEY_HERE');
        if (urlParams.length > 0) {
            this.currentCommandAsGetRequest = `https://${window.location.hostname}/nagios_module/cmd/${destination}.json?command=${commandName}&${urlParams.join('&')}&apikey=${API_KEY_TRANSLATION}`;
        } else {
            this.currentCommandAsGetRequest = `https://${window.location.hostname}/nagios_module/cmd/${destination}.json?command=${commandName}&apikey=${API_KEY_TRANSLATION}`;
        }

        this.currentCommandAsPostRequest = `curl -X POST -k -H "Content-Type: application/json" https://${window.location.hostname}/nagios_module/cmd/${destination}.json?apikey=${API_KEY_TRANSLATION} -d '${JSON.stringify(postJson)}'`;

        this.currentCommandName = commandName;
        this.currentCommandForNaemonIoDocs = commandName.toLowerCase();
    }
}
