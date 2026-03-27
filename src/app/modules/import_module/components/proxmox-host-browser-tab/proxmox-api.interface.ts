import { ExternalSystems } from '../../pages/externalsystems/external-systems.enum';


export interface AdditionalHostInformationProxmoxResult {

    response: {
        result?: null // only null if the Proxmox is offline - does not exist in successful for Proxmox Reponse
        status: boolean // true = online, false = offline
        ipaddresses: Ipaddress[]
        found: boolean
        // Generic VM info
        info: null | {
            node: string
            vmid: number
            name: string
            status: 'running' | 'stopped' | 'paused' | string
            identifier: string
            ipaddress: string
        },
        current: null | ProxmoxQemuStatusCurrentMinimal | ProxmoxQemuStatusCurrentRunning
        agent: null | ProxmoxQemuAgent
    },
    data_source: ExternalSystems.Proxmox,
    _csrfToken: null | string
}

// The minimum information we get from Proxmox even if the VM is powered off.
export interface ProxmoxQemuStatusCurrentMinimal {
    memhost: number // Current memory usage on the host in bytes.
    uptime: number // Uptime in seconds
    maxmem: number // Maximum memory in bytes.
    vmid: number
    netout: number  // Traffic in bytes sent from the VM to the network since it was started
    netin: number // Traffic in bytes sent to the VM over the network since it was started
    cpus: number // Number of configured vCPU Cores
    status: "stopped" | "running"
    mem: number // Currently used memory in bytes.
    qmpstatus: "stopped" | "running" | "paused" | string // Whatever qemu returns as status
    clipboard: any
    name: string // Name of the VM
    cpu: number // Currently used CPU in percent (multiply by 100 to get percentage)
    ha: {
        managed: 0 | 1,
        state?: "started" | "stopped" | string
    }
    maxdisk: number // Root disk size in bytes.
    agent: 0 | 1 // QEMU Guest Agent enabled
    serial: 0 | 1 // Serial console enabled
    spice?: 0 | 1 // SPICE enabled
    template?: 0 | 1 // Whether the VM is a template
    disk: number // ??
}

// Proxmox API Result we get when a VM is powered on
export interface ProxmoxQemuStatusCurrentRunning extends ProxmoxQemuStatusCurrentMinimal {
    pressurememorysome?: number // Memory Some pressure stall average over the last 10 seconds.
    diskwrite?: number
    "running-qemu"?: string // The QEMU version the VM is currently using (if running).
    pid?: number // PID of QEMU process (if running).
    pressureiofull?: number
    pressurecpufull?: number
    freemem?: number
    "running-machine"?: string // The currently running machine type (if running).
    pressurememoryfull?: number
    blockstat?: any
    diskread?: number
    balloon?: number // Minimum memory if ballooning is active in bytes.
    balloon_min?: number // Minimum memory if ballooning is active in bytes.
    nics?: any
    ballooninfo?: ProxmoxBalloonInfo
    "proxmox-support"?: any
    pressureiosome?: number
    pressurecpusome?: number
    lock?: 'migrate' | 'suspended' | string
}

export interface ProxmoxBalloonInfo {
    mem_swapped_in: number
    minor_page_faults: number
    free_mem: number
    major_page_faults: number
    max_mem: number
    last_update: number // unix timestamp
    actual: number
    total_mem: number
    mem_swapped_out: number
}

export interface ProxmoxQemuAgent {
    "kernel-version": string // #106-Ubuntu SMP PREEMPT_DYNAMIC Fri Mar  6 07:58:08 UTC 2026 | 10.0 | #1 SMP Sun Mar 8 20:06:07 EDT 2026 | #1 SMP PREEMPT_DYNAMIC Debian 6.12.73-1 (2026-02-17)
    machine: string // x86_64
    "version-id": string // 24.04 | 2025 | 8.10 | 13
    name: string // Ubuntu | Microsoft Windows | AlmaLinux | Debian GNU/Linux
    "kernel-release": string // 6.8.0-106-generic | 26100 | 4.18.0-553.111.1.el8_10.x86_64 | 6.12.73+deb13-amd64
    version: string // 24.04.4 LTS (Noble Numbat) | Microsoft Windows Server 2025 | 8.10 (Cerulean Leopard) | 13 (trixie)
    id: string // ubuntu | mswindows | almalinux | debian
    "pretty-name": string // Ubuntu 24.04.4 LTS | Windows Server 2025 Standard | AlmaLinux 8.10 (Cerulean Leopard) | Debian GNU/Linux 13 (trixie)
}

export interface Ipaddress {
    hardware_address: string
    name: string
    ip_address: IpAddress[]
}

export interface IpAddress {
    ip_address: string
    ip_address_type: string
    prefix: number
}

export interface RunProxmoxCommandApiResult {
    result: {
        upid: false | string // Unique identifier for the task, used to track its progress. False if the command failed to start.
        message: string // Error message in fase of upid is false
    }
    _csrfToken: null | string
}
