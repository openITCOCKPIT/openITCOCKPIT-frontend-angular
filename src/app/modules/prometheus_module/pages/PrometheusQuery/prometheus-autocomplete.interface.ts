// GET	/api/v1/metadata
// Listet Endpunkte / Metriken auf
export interface MetadataResponseRoot {
    data: MetadataResponse
}

export interface MetadataResponse {
    [key: string]: MetadataInfo[]
}

export interface MetadataInfo {
    type: string
    help: string
    unit: string
}


// POST	/api/v1/series
export interface Root {
    status: string
    data: Daum[]
}

export interface Daum {
    __name__: string
    domain: string
    entity: string
    friendly_name: string
    instance: string
    job: string
    service: string
    uuid: string
}

