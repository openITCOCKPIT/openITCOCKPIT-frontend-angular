import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    effect,
    inject,
    input,
    InputSignal
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'oitc-patchstatus-icon',
    imports: [
        FaIconComponent
    ],
    templateUrl: './patchstatus-icon.component.html',
    styleUrls: [
        './patchstatus-icon.component.scss',
        '../../../../assets/styles/font-logos/font-logos.css'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatchstatusIconComponent {

    public platform: InputSignal<string> = input<string>('');
    public family: InputSignal<string> = input<string>('');
    public type: InputSignal<string> = input<string>(''); // windows, linux, macos
    public version: InputSignal<string> = input<string>('');

    public prettyName: string = '';
    public colorClass = '';

    private cdr = inject(ChangeDetectorRef);

    public icon = computed(() => {
        return this.getIconColorAndText()
    });

    constructor() {
        effect(() => {
            this.getIconColorAndText();
        });
    }

    public getIconColorAndText() {
        if (this.type() === '') {
            return [];
        }

        //this.cdr.markForCheck();

        // All known values for platform on linux:
        //https://github.com/shirou/gopsutil/blob/ace8daec118ff6951efdb8d600d607abed589246/host/host_linux.go#L295-L322

        // Available icons:
        // https://github.com/lukas-w/font-logos?tab=readme-ov-file#usage
        if (this.type() === 'macos') {
            this.prettyName = 'macOS';
            return ['fl-apple'];
        }

        if (this.family() === 'suse') {
            switch (this.platform()) {
                case 'sles':
                    this.prettyName = 'SUSE Linux Enterprise Server';
                    break;
                case 'sled':
                    this.prettyName = 'SUSE Linux Enterprise Desktop';
                    break;
                case 'opensuse-leap':
                    this.prettyName = 'openSUSE Leap';
                    break;
                case 'opensuse-tumbleweed':
                    this.prettyName = 'openSUSE Tumbleweed';
                    break;

                default:
                    this.prettyName = 'openSUSE';
                    break;
            }

            this.colorClass = 'color-opensuse';
            return ['fl-opensuse']; // Array in case we want to add more classes later
        }

        switch (this.platform()) {
            case 'ubuntu':
                this.prettyName = 'Ubuntu';
                this.colorClass = 'color-ubuntu';
                return ['fl-ubuntu'];
            case 'linuxmint':
                this.prettyName = 'Linux Mint';
                this.colorClass = 'color-linuxmint';
                return ['fl-linuxmint'];

            case 'debian':
                this.prettyName = 'Debian';
                this.colorClass = 'color-debian';
                return ['fl-debian'];
            case 'raspbian':
                this.prettyName = 'Raspbian';
                this.colorClass = 'color-raspbian';
                return ['fl-raspberry-pi'];

            case 'fedora':
                this.prettyName = 'Fedora';
                this.colorClass = 'color-fedora';
                return ['fl-fedora'];

            case 'redhat':
                this.prettyName = 'Red Hat';
                this.colorClass = 'color-redhat';
                return ['fl-redhat'];
            case 'centos':
                this.prettyName = 'CentOS';
                this.colorClass = 'color-centos';
                return ['fl-centos'];
            case 'almalinux':
                this.prettyName = 'AlmaLinux';
                return ['fl-almalinux'];
            case 'rocky':
                this.prettyName = 'Rocky Linux';
                this.colorClass = 'color-rocky';
                return ['fl-rocky-linux'];

            case 'arch':
                this.prettyName = 'Arch Linux';
                this.colorClass = 'color-archlinux';
                return ['fl-archlinux'];

            default:
                this.prettyName = this.platform();
                break;
        }

        return ['fl-tux'];
    }
}
