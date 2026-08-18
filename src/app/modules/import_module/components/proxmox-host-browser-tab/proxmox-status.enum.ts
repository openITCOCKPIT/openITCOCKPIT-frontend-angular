export enum ProxmoxStatus {
    Running = 'running',
    Stopped = 'stopped',
    Paused = 'paused',
    Suspended = 'suspended', // Hibernating
    Migrate = 'migrate',
}

export enum ProxmoxCommands {
    Start = 'start',
    Pause = 'pause',
    Suspend = 'suspend',
    Resume = 'resume',
    Shutdown = 'shutdown',
    Stop = 'stop',
    Reboot = 'reboot',
    Reset = 'reset',
}
