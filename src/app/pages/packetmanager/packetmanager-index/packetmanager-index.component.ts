import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';

import { NgClass, NgForOf, NgIf } from '@angular/common';
import {
  AlertComponent,
  BadgeComponent,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardTitleDirective,
  ColComponent,
  ContainerComponent,
  FormCheckInputDirective,
  InputGroupTextDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalService,
  ModalToggleDirective,
  RowComponent
} from '@coreui/angular';


import { FormsModule } from '@angular/forms';

import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { PacketmanagerIndexRoot, PacketmanagerModule } from '../packetmanager.interface';
import { Subscription } from 'rxjs';
import { PacketmanagerService } from '../packetmanager.service';
import { TrustAsHtmlPipe } from '../../../pipes/trust-as-html.pipe';
import { RepositoryCheckerComponent } from '../../../components/repository-checker/repository-checker.component';
import { ConsoleCopyComponent } from '../../../components/console-copy/console-copy.component';

@Component({
    selector: 'oitc-packetmanager-index',
    imports: [
    FaIconComponent,
    PermissionDirective,
    TranslocoDirective,
    RouterLink,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckInputDirective,
    FormsModule,
    XsButtonDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalFooterComponent,
    ModalToggleDirective,
    ModalBodyComponent,
    AlertComponent,
    NgIf,
    NgForOf,
    TranslocoPipe,
    ColComponent,
    BadgeComponent,
    RowComponent,
    NgClass,
    ContainerComponent,
    InputGroupTextDirective,
    TrustAsHtmlPipe,
    ButtonGroupComponent,
    RepositoryCheckerComponent,
    ConsoleCopyComponent
],
    templateUrl: './packetmanager-index.component.html',
    styleUrl: './packetmanager-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PacketmanagerIndexComponent implements OnInit, OnDestroy {

    private readonly subscriptions: Subscription = new Subscription();
    private readonly modalService: ModalService = inject(ModalService);
    private readonly PacketmanagerService: PacketmanagerService = inject(PacketmanagerService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);


    protected modulesToCheckboxesInstall: { [key: string]: boolean } = {};
    private packageList: string = '';
    protected debianCommand: string = '';
    protected rhelCommand: string = '';
    protected data: PacketmanagerIndexRoot = {
        result: {
            error: false,
            error_msg: '',
            data: {
                modules: [],
                changelog: [],
                isDebianBased: false,
                isRhelBased: false,
                isContainer: false,
                codename: '',
                systemname: '',
                newVersion: false,
                version: '',
                logoUrl: '',
                _csrfToken: ''
            }
        },
        installedModules: {},
        OPENITCOCKPIT_VERSION: '',
        _csrfToken: '',
    };

    private cdr = inject(ChangeDetectorRef);


    public ngOnInit() {
        this.subscriptions.add(this.PacketmanagerService.getIndex()
            .subscribe((result: PacketmanagerIndexRoot): void => {
                this.data = result;
                this.cdr.markForCheck();

                this.initializeModulesToCheckboxesInstall();
            })
        )
    }

    private initializeModulesToCheckboxesInstall(): void {
        this.data.result.data.modules.forEach((module: PacketmanagerModule) => {
            this.modulesToCheckboxesInstall[module.Module.apt_name] = false;
        });
        this.cdr.markForCheck();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    protected splitV3Tags(tags: string | string[]): string[] {
        if (typeof tags === 'string') {
            return tags.split(',');
        }
        return tags;
    }

    protected installPacket(aptName: string): void {
        this.modulesToCheckboxesInstall[aptName] = !this.modulesToCheckboxesInstall[aptName];

        let packages: string[] = [];
        this.data.result.data.modules.forEach((module: PacketmanagerModule) => {
            if (this.modulesToCheckboxesInstall[module.Module.apt_name]) {
                packages.push(module.Module.apt_name);
            }
        });
        this.packageList = packages.join(' \\ \n');

        this.buildCommands();
        this.modalService.toggle({
            show: true,
            id: 'installPacketModal'
        });
        this.cdr.markForCheck();

    }

    private buildCommands(): void {
        this.debianCommand = `sudo apt-get update && sudo apt-get dist-upgrade
sudo apt-get install ${this.packageList} \\
&& echo "#########################################" \\
&& echo "${this.TranslocoService.translate('Installation done. Please reload your {0} web interface.', {systemname: this.data.result.data.systemname})}"`;

        this.rhelCommand = `sudo dnf check-update
sudo dnf upgrade \\
sudo dnf install ${this.packageList} \\
&& echo "#########################################" \\
&& echo "${this.TranslocoService.translate('Installation done. Please reload your {0} web interface.', {systemname: this.data.result.data.systemname})}"`;
        this.cdr.markForCheck();
    }


    protected openChangeLog(): void {
        this.modalService.toggle({
            show: true,
            id: 'changelogModal'
        });
    }
}
