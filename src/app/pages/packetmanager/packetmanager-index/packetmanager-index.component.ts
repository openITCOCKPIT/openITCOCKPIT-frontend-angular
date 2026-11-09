import {
    afterNextRender,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Injector,
    OnDestroy,
    OnInit
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {
    AlertComponent,
    CardTextDirective,
    CardFooterComponent,
    ButtonGroupComponent,
    BadgeComponent,
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormControlDirective,
    InputGroupComponent,
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

import { PacketmanagerIndexRoot, PacketmanagerModule } from '../packetmanager.interface';
import { Subscription } from 'rxjs';
import { PacketmanagerService } from '../packetmanager.service';
import { TrustAsHtmlPipe } from '../../../pipes/trust-as-html.pipe';
import { RepositoryCheckerComponent } from '../../../components/repository-checker/repository-checker.component';
import { ConsoleCopyComponent } from '../../../components/console-copy/console-copy.component';
import { EolAlertsComponent } from '../../administrators/administrators-debug/eol-alerts/eol-alerts.component';
import { TitleService } from '../../../services/title.service';

type PacketmanagerFilter = 'all' | 'community' | 'enterprise' | 'installed';

@Component({
    selector: 'oitc-packetmanager-index',
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FormsModule,
        ButtonDirective,
        FormControlDirective,
        InputGroupComponent,
        ModalComponent,
        ModalHeaderComponent,
        ModalFooterComponent,
        ModalToggleDirective,
        ModalBodyComponent,
        AlertComponent,
        CardTextDirective,
        CardFooterComponent,
        ButtonGroupComponent,
        BadgeComponent,
        TranslocoPipe,
        ColComponent,
        RowComponent,
        InputGroupTextDirective,
        TrustAsHtmlPipe,
        RepositoryCheckerComponent,
        ConsoleCopyComponent,
        EolAlertsComponent
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
    private readonly TitleService: TitleService = inject(TitleService);

    public newVersionAvailable: boolean = false;
    protected highlightedPacket: string | null = null;

    protected modulesToCheckboxesInstall: { [key: string]: boolean } = {};
    protected selectedModules: string[] = [];

    protected searchText: string = '';
    protected activeFilter: PacketmanagerFilter = 'all';
    protected visibleModules: PacketmanagerModule[] = [];
    protected readonly filterOptions: { key: PacketmanagerFilter, label: string }[] = [
        {key: 'all', label: 'All'},
        {key: 'community', label: 'Community'},
        {key: 'enterprise', label: 'Enterprise'},
        {key: 'installed', label: 'Installed'}
    ];
    protected filterCounts: Record<PacketmanagerFilter, number> = {all: 0, community: 0, enterprise: 0, installed: 0};
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
                php_version: '',
                isContainer: false,
                LsbRelease: '',
                systemname: '',
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
    private readonly ActivatedRoute: ActivatedRoute = inject(ActivatedRoute);
    private readonly injector: Injector = inject(Injector);


    public ngOnInit() {
        this.TitleService.setTitle(this.TranslocoService.translate('Packagemanager'));
        this.subscriptions.add(this.PacketmanagerService.getIndex().subscribe((result: PacketmanagerIndexRoot): void => {
                this.data = result;
                this.cdr.markForCheck();

                if (result && result.result.error === false) {
                    const currentVersion = parseInt(result.OPENITCOCKPIT_VERSION.replace(/\D/g, ''), 10); //Remove all non numbers and parse to int
                    const newVersion = parseInt(result.result.data.changelog[0].Changelog.version.replace(/\D/g, ''), 10); //Remove all non numbers and parse to int

                    this.newVersionAvailable = currentVersion < newVersion;
                }

                this.initializeModulesToCheckboxesInstall();
                this.calcFilterCounts();
                this.applyFilter();

                this.highlightedPacket = this.ActivatedRoute.snapshot.queryParamMap.get('packetName');
                if (this.highlightedPacket) {
                    this.scrollToPacket(this.highlightedPacket);
                }
            })
        );
    }

    private scrollToPacket(packetName: string): void {
        afterNextRender(() => {
            document.getElementById(packetName)?.scrollIntoView({behavior: 'smooth', block: 'center'});
        }, {injector: this.injector});
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

    protected isInstalled(module: PacketmanagerModule): boolean {
        return !!this.data.installedModules[module.Module.apt_name];
    }

    private matchesFilter(module: PacketmanagerModule, filter: PacketmanagerFilter): boolean {
        switch (filter) {
            case 'community':
                return !module.Module.enterprise;
            case 'enterprise':
                return module.Module.enterprise;
            case 'installed':
                return this.isInstalled(module);
            default:
                return true;
        }
    }

    private calcFilterCounts(): void {
        const modules = this.data.result.data.modules;
        for (const option of this.filterOptions) {
            this.filterCounts[option.key] = modules.filter(m => this.matchesFilter(m, option.key)).length;
        }
    }

    protected setFilter(filter: PacketmanagerFilter): void {
        this.activeFilter = filter;
        this.applyFilter();
    }

    protected applyFilter(): void {
        const search = this.searchText.trim().toLowerCase();
        this.visibleModules = this.data.result.data.modules.filter((module: PacketmanagerModule) => {
            if (!this.matchesFilter(module, this.activeFilter)) {
                return false;
            }
            if (search === '') {
                return true;
            }
            const haystack = [
                module.Module.name,
                module.Module.description,
                module.Module.author,
                ...this.splitV3Tags(module.Module.tags || [])
            ].join(' ').toLowerCase();
            return haystack.includes(search);
        });
        this.cdr.markForCheck();
    }

    protected toggleModule(aptName: string): void {
        this.modulesToCheckboxesInstall[aptName] = !this.modulesToCheckboxesInstall[aptName];
        this.updateSelection();
    }

    protected clearSelection(): void {
        Object.keys(this.modulesToCheckboxesInstall).forEach((aptName: string) => {
            this.modulesToCheckboxesInstall[aptName] = false;
        });
        this.updateSelection();
    }

    private updateSelection(): void {
        this.selectedModules = this.data.result.data.modules
            .map((module: PacketmanagerModule) => module.Module.apt_name)
            .filter((aptName: string) => this.modulesToCheckboxesInstall[aptName]);
        this.packageList = this.selectedModules.join(' \\ \n');

        this.buildCommands();
        this.cdr.markForCheck();
    }

    protected showInstallCommand(): void {
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
