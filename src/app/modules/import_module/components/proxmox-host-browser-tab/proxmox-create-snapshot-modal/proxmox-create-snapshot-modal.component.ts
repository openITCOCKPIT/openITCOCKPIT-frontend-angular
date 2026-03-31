import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    EventEmitter,
    inject,
    input,
    OnDestroy,
    Output,
    ViewChild
} from '@angular/core';
import {
    ButtonCloseDirective,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormLabelDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    RowComponent
} from '@coreui/angular';
import { catchError, EMPTY, Subscription, switchMap, takeWhile, timer } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ProxmoxService } from '../proxmox.service';
import { ProxmoxStatus } from '../proxmox-status.enum';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProxmoxCreateSnapshotParams, ProxmoxGetTaskStatusParams } from '../proxmox-api.interface';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';

@Component({
    selector: 'oitc-proxmox-create-snapshot-modal',
    imports: [
        ButtonCloseDirective,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        RowComponent,
        TranslocoDirective,
        XsButtonDirective,
        FaIconComponent,
        ColComponent,
        FormControlDirective,
        FormLabelDirective,
        ReactiveFormsModule,
        FormsModule,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        RequiredIconComponent
    ],
    templateUrl: './proxmox-create-snapshot-modal.component.html',
    styleUrl: './proxmox-create-snapshot-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProxmoxCreateSnapshotModalComponent implements OnDestroy {


    public hostId = input<number>(0);
    public vmid = input<string>('');
    public nodeName = input<string>('');
    public status = input<ProxmoxStatus>(ProxmoxStatus.Stopped);

    @Output() onFinish = new EventEmitter<boolean>();

    public isRunning: boolean = false;
    public postData: {
        name: string,
        desc: string,
        ram: boolean
    } = this.resetForm();
    public isValidName: boolean = true;


    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    private pollingSub: Subscription = new Subscription();
    private readonly ProxmoxService: ProxmoxService = inject(ProxmoxService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    private upid: false | string = false;

    // see https://github.com/proxmox/pve-manager/blob/e855296b69c40dd62f929c26da3ea2be00cfffde/www/manager6/qemu/CmdMenu.js#L59-L120
    protected readonly ProxmoxStatus = ProxmoxStatus;

    @ViewChild('modal') private modal!: ModalComponent;


    public constructor() {
        effect(() => {
            // initialize the inputs to trigger the effect when they change
            this.hostId();
            this.nodeName();
            this.vmid();
            this.status();
        });
    }

    public ngOnDestroy(): void {
        this.isValidName = true;
        this.isRunning = false;
        this.resetForm();
        this.subscriptions.unsubscribe();
    }

    public hideModal() {
        this.modalService.toggle({
            show: false,
            id: this.modal.id
        });
    }

    public createSnapshot() {
        // Validate name to have 2 characters, starts with a latter, A-Z, a-z, 0-9 _
        const regex = /^[A-Za-z][A-Za-z0-9_]{1,}$/;
        this.isValidName = regex.test(this.postData.name);
        this.cdr.markForCheck();
        if (!this.isValidName) {
            return;
        }

        this.isRunning = true;
        this.cdr.markForCheck();

        const data: ProxmoxCreateSnapshotParams = {
            name: this.postData.name,
            description: this.postData.desc,
            includeRam: this.postData.ram,
            vmid: this.vmid(),
            type: 'qemu',
            node: this.nodeName()
        }
        this.subscriptions.add(this.ProxmoxService.createSnapshot(this.hostId(), data).subscribe(response => {
            this.cdr.markForCheck();

            if (response.result.upid === false) {
                this.isRunning = false;
                this.notyService.genericError(response.result.message, 'Snapshot');
                return;
            }

            // Start periodic update to check if the snapshot has been created
            this.checkTaskStatus(response.result.upid);
        }));
    }

    public checkTaskStatus(upid: string) {
        const params: ProxmoxGetTaskStatusParams = {
            node: this.nodeName(),
            upid: upid
        };

        // Auto refresh every second
        this.pollingSub = timer(500, 2000).pipe(
            switchMap(() => this.ProxmoxService.getTaskStatus(this.hostId(), params)),
            // Stop polling if task status is stopped and return the last value
            takeWhile(res => {
                return res.status.status !== 'stopped';
            }, true),
            catchError(err => {
                console.error('Critical error, stop polling:', err);
                return EMPTY;
            })
        ).subscribe({
            next: (res) => {
                if (res.status.status === 'stopped') {
                    this.isRunning = false;
                    if (res.status.exitstatus === 'OK') {
                        const message = this.TranslocoService.translate('Snapshot created successfully');
                        this.notyService.genericSuccess(message, 'Snapshot');
                        this.cdr.markForCheck();

                        this.hideModal();
                        this.onFinish.emit(true);
                        return;
                    } else {
                        // Stopped but with error
                        this.notyService.genericError(res.status.exitstatus, 'Snapshot');
                        this.cdr.markForCheck();

                        this.onFinish.emit(false);
                    }
                }
            },
            complete: () => {
                // Polling completed
            }
        });
    }

    private resetForm(): {
        name: string,
        desc: string,
        ram: boolean
    } {
        return {
            name: '',
            desc: '',
            ram: true
        };
    }
}
