// This interface is 1:1 the same as the src/itnovum/openITCOCKPIT/Core/Views/Host.php class
export interface HostObject {
    id?: number
    uuid?: string
    hostname?: string // same as name
    address?: string
    description?: string
    hosttemplate_id?: number
    active_checks_enabled?: boolean
    satelliteId?: number
    containerId?: number
    containerIds?: number[]
    tags?: string
    usageFlag?: number
    allow_edit?: boolean
    disabled?: boolean
    priority?: number
    notes?: string
    is_satellite_host: boolean
    name?: string // same as hostname
}

// Same as HostObject but with "Host" key in between as CakePHP 2 does.
// [Host][name] instead of [name]
export interface HostObjectCake2 {
    Host: HostObject
}
