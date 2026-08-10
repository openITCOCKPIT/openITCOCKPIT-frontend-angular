// Keep in sync with the backend 'Importer.php' Entity
export enum ImporterStatusEnum {
    STATUS_RUNNING = 1 << 0,                // 1
    STATUS_FINISHED_SUCCESSFUL = 1 << 1,    // 2
    STATUS_FAILED = 1 << 2,                 // 4
}
