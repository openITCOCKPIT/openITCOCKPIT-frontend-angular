import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    input,
    OnDestroy,
    Output
} from '@angular/core';
import {
    AlertComponent,
    ButtonCloseDirective,
    ButtonDirective,
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
    RowComponent
} from '@coreui/angular';
import { catchError, EMPTY, Observable, Subscription, switchMap, takeWhile, timer } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ProxmoxService } from '../proxmox.service';
import { ProxmoxStatus } from '../proxmox-status.enum';
import {
    ProxmoxGetHardwareParams,
    ProxmoxGetTaskStatusParams,
    ProxmoxHardwareApiResult,
    ProxmoxHardwareConfig,
    ProxmoxResizeDiskData,
    ProxmoxUpdateHardwareData,
    ProxmoxVirtType
} from '../proxmox-api.interface';
import { ByteToHumanPipe } from '../../../../../pipes/byte-to-human.pipe';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { BlockLoaderComponent } from '../../../../../layouts/primeng/loading/block-loader/block-loader.component';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { GenericValidationError } from '../../../../../generic-responses';

@Component({
    selector: 'oitc-proxmox-edit-hardware-modal',
    imports: [
        AlertComponent,
        ButtonCloseDirective,
        ButtonDirective,
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
        RowComponent,
        FormsModule,
        FaIconComponent,
        TranslocoDirective,
        ByteToHumanPipe,
        RequiredIconComponent,
        BlockLoaderComponent,
        FormErrorDirective,
        FormFeedbackComponent
    ],
    templateUrl: './proxmox-edit-hardware-modal.component.html',
    styleUrl: './proxmox-edit-hardware-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProxmoxEditHardwareModalComponent implements OnDestroy {

    public static readonly MODAL_ID = 'proxmoxEditHardwareModal';
    protected readonly modalId = ProxmoxEditHardwareModalComponent.MODAL_ID;

    public hostId = input<number>(0);
    public vmid = input<string>('');
    public nodeName = input<string>('');
    public status = input<ProxmoxStatus>(ProxmoxStatus.Stopped);
    public virtType = input<ProxmoxVirtType>(ProxmoxVirtType.Qemu);

    @Output() onFinish = new EventEmitter<boolean>();

    public isLoading: boolean = false;
    public isRunning: boolean = false;
    public hardware?: ProxmoxHardwareConfig;

    public form = {
        cores: 1,
        sockets: 1,
        memory: 512, // MiB
        swap: 0 // MiB
    };

    public diskForm = {
        disk: '',
        increaseGiB: 1
    };

    // true = the user clicked "Resize disk" and we show the inline confirmation
    // We can not use the ConfirmModalService here, because CoreUI closes all other modals (including this one) when a new modal gets opened.
    public isResizeConfirmPending: boolean = false;

    // CakePHP style validation errors: {field: {ruleName: 'message'}}
    public errors: GenericValidationError | null = null;

    private subscriptions: Subscription = new Subscription();
    private pollingSub: Subscription = new Subscription();

    private readonly modalService = inject(ModalService);
    private readonly ProxmoxService = inject(ProxmoxService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly cdr = inject(ChangeDetectorRef);

    protected readonly ProxmoxVirtType = ProxmoxVirtType;

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.pollingSub.unsubscribe();
    }

    public onVisibleChange(visible: boolean): void {
        if (visible) {
            this.loadHardware();
        } else {
            this.pollingSub.unsubscribe();
            this.hardware = undefined;
            this.errors = null;
            this.isRunning = false;
            this.isResizeConfirmPending = false;
        }
    }

    public hideModal(): void {
        this.modalService.toggle({
            show: false,
            id: this.modalId
        });
    }

    public loadHardware(): void {
        if (this.hostId() === 0 || this.vmid() === '') {
            return;
        }
        const params: ProxmoxGetHardwareParams = {
            node: this.nodeName(),
            vmid: this.vmid(),
            type: this.virtType()
        };

        this.isLoading = true;
        this.cdr.markForCheck();
        this.subscriptions.add(this.ProxmoxService.getHardware(this.hostId(), params).subscribe({
            next: (result) => {
                this.hardware = result.hardware;
                this.form = {
                    cores: result.hardware.cores,
                    sockets: result.hardware.sockets ?? 1,
                    memory: result.hardware.memory,
                    swap: result.hardware.swap ?? 0
                };
                this.diskForm = {
                    disk: result.hardware.disks[0]?.key ?? '',
                    increaseGiB: 1
                };
                this.isLoading = false;
                this.cdr.markForCheck();
            },
            error: () => {
                this.isLoading = false;
                this.notyService.genericError();
                this.cdr.markForCheck();
            }
        }));
    }

    /**
     * Returns a list of settings (field names) which can NOT be applied at runtime and will therefore
     * be stored as pending changes by Proxmox until the next restart of the VM.
     * Empty array = all changes will be applied immediately.
     *
     * QEMU rules (https://pve.proxmox.com/wiki/Hotplug_(qemu_disk,nic,cpu,memory)):
     * - cores / sockets define the CPU topology and can NEVER be changed at runtime
     *   (CPU hotplug via the "vcpus" option is not supported to keep things simple)
     * - memory can be changed at runtime if "memory" is in hotplug AND NUMA is enabled
     *
     * LXC containers support live changes for cores, memory and swap.
     */
    public get restartRequiredFor(): Array<'cores' | 'sockets' | 'memory'> {
        const hw = this.hardware;
        if (!hw || this.virtType() !== ProxmoxVirtType.Qemu) {
            return [];
        }
        if (this.status() !== ProxmoxStatus.Running && this.status() !== ProxmoxStatus.Paused) {
            // No QEMU process - changes are applied on next start anyway
            return [];
        }

        // Proxmox gives hotplug features as a comma-separated string, e.g. "network,disk,usb"
        const hotplug = (hw.hotplug ?? '').split(',').map(v => v.trim());
        // To enable memory hotplug you need to enable both NUMA and memory hotplug
        // https://pve.proxmox.com/wiki/Hotplug_(qemu_disk,nic,cpu,memory)#Memory_Hotplug
        const memHotplug = hotplug.includes('memory') && !!hw.numa;

        const result: Array<'cores' | 'sockets' | 'memory'> = [];
        if (this.form.cores !== hw.cores) {
            result.push('cores');
        }
        if (this.form.sockets !== (hw.sockets ?? 1)) {
            result.push('sockets');
        }
        if (this.form.memory !== hw.memory && !memHotplug) {
            result.push('memory');
        }
        return result;
    }

    /**
     * Returns true if all changes can be applied immediately without a restart of the VM.
     */
    public get isLiveChangePossible(): boolean {
        return this.restartRequiredFor.length === 0;
    }

    /**
     * Returns true if the user changed any of the hardware settings in the form compared to the current hardware configuration.
     */
    public get hasHardwareChanges(): boolean {
        const hw = this.hardware;
        if (!hw) {
            return false;
        }
        if (this.form.cores !== hw.cores || this.form.memory !== hw.memory) {
            return true;
        }
        if (this.virtType() === ProxmoxVirtType.Qemu) {
            return this.form.sockets !== (hw.sockets ?? 1);
        }
        return this.form.swap !== (hw.swap ?? 0);
    }

    /**
     * Returns the total number of virtual CPUs (vCPUs) defined by the CPU topology of the form.
     * For QEMU/KVM VMs, this is calculated as cores * sockets. For LXC containers, it is simply the number of cores.
     *
     * This is a "JavaScript getter" you can access it in the template as {{ maxVCpus }} or in the code as this.maxVCpus. No () like "maxVCpus()" are needed.
     */
    public get maxVCpus(): number {
        if (this.virtType() === ProxmoxVirtType.Qemu) {
            return this.form.cores * this.form.sockets;
        }
        return this.form.cores;
    }

    /**
     * Returns the size of the selected disk in bytes, or undefined if no disk is selected or the hardware configuration is not loaded yet.
     */
    public get selectedDiskSize(): number | undefined {
        return this.hardware?.disks.find(d => d.key === this.diskForm.disk)?.size;
    }

    public setMemoryGiB(gib: number): void {
        this.form.memory = gib * 1024;
        this.cdr.markForCheck();
    }

    public saveHardware(): void {
        if (!this.hardware) {
            return;
        }

        // Validation is done by the backend (ProxmoxHardwareForm)
        const data: ProxmoxUpdateHardwareData = {
            node: this.nodeName(),
            vmid: this.vmid(),
            type: this.virtType(),
            cores: this.form.cores,
            memory: this.form.memory
        };
        if (this.virtType() === ProxmoxVirtType.Qemu) {
            data.sockets = this.form.sockets;
        } else {
            data.swap = this.form.swap;
        }

        this.runAction(
            this.ProxmoxService.updateHardware(this.hostId(), data),
            this.TranslocoService.translate('Hardware configuration updated successfully')
        );
    }

    /**
     * First step: Show the inline confirmation ("Are you sure? Disks can not be shrunk!")
     */
    public askResizeDisk(): void {
        if (!this.hardware || this.isRunning) {
            return;
        }
        this.errors = null;
        this.isResizeConfirmPending = true;
        this.cdr.markForCheck();
    }

    public cancelResizeDisk(): void {
        this.isResizeConfirmPending = false;
        this.cdr.markForCheck();
    }

    /**
     * Second step: The user confirmed the resize - send the request to the backend
     */
    public resizeDisk(): void {
        if (!this.hardware || !this.isResizeConfirmPending) {
            return;
        }
        this.isResizeConfirmPending = false;

        // Validation is done by the backend (ProxmoxResizeDiskForm)
        const data: ProxmoxResizeDiskData = {
            node: this.nodeName(),
            vmid: this.vmid(),
            type: this.virtType(),
            disk: this.diskForm.disk,
            increaseGiB: this.diskForm.increaseGiB
        };

        this.runAction(
            this.ProxmoxService.resizeDisk(this.hostId(), data),
            this.TranslocoService.translate('Disk resized successfully')
        );
    }

    /**
     * Runs the given request$ observable and handles the response, errors and task polling.
     * @param request$
     * @param successMessage
     * @private
     */
    private runAction(request$: Observable<ProxmoxHardwareApiResult>, successMessage: string): void {
        this.isRunning = true;
        this.errors = null;
        this.cdr.markForCheck();

        this.subscriptions.add(request$.subscribe({
            next: (response) => {
                if (!response.result.success) {
                    this.isRunning = false;
                    this.notyService.genericError(response.result.message, 'Proxmox');
                    this.cdr.markForCheck();
                    return;
                }

                if (response.result.upid === null) {
                    // Proxmox applied the change synchronously
                    this.finish(true, successMessage);
                    return;
                }

                this.waitForTask(response.result.upid, successMessage);
            },
            error: (error: HttpErrorResponse) => {
                this.isRunning = false;
                if (error.status === 400 && error.error?.error) {
                    // Validation errors of the backend in the CakePHP format {field: {rule: message}}
                    // We always assign a NEW object, because <oitc-form-feedback> only reacts on reference changes.
                    this.errors = {...(error.error.error as GenericValidationError)};
                    this.notyService.genericError();
                } else {
                    this.notyService.genericError(error.error?.message);
                }
                this.cdr.markForCheck();
            }
        }));
    }

    /**
     * Query the Proxmox API for the status of the task with the given UPID until it is finished (status=stopped).
     * @param upid
     * @param successMessage
     * @private
     */
    private waitForTask(upid: string, successMessage: string): void {
        const params: ProxmoxGetTaskStatusParams = {
            node: this.nodeName(),
            upid: upid
        };

        this.pollingSub.unsubscribe();
        this.pollingSub = timer(500, 2000).pipe(
            switchMap(() => this.ProxmoxService.getTaskStatus(this.hostId(), params)),
            takeWhile(res => res.status.status !== 'stopped', true),
            catchError(err => {
                console.error('Critical error, stop polling:', err);
                this.isRunning = false;
                this.cdr.markForCheck();
                return EMPTY;
            })
        ).subscribe(res => {
            if (res.status.status !== 'stopped') {
                return;
            }
            if (res.status.exitstatus === 'OK') {
                this.finish(true, successMessage);
            } else {
                this.notyService.genericError(res.status.exitstatus, 'Proxmox');
                this.finish(false);
            }
        });
    }

    /**
     * Finishes the current action, shows a success message if given and reloads the hardware configuration.
     * @param success
     * @param successMessage
     * @private
     */
    private finish(success: boolean, successMessage?: string): void {
        this.isRunning = false;
        if (success && successMessage) {
            this.notyService.genericSuccess(successMessage, 'Proxmox');
        }
        this.onFinish.emit(success);

        // Reload the configuration so the modal shows the new values (e.g. new disk size)
        this.loadHardware();
        this.cdr.markForCheck();
    }
}

