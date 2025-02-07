import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';

// INDEX
export interface PrometheusExportersIndex extends PaginateOrScroll {
    all_exporters: Exporter[]
}

export interface Exporter extends PrometheusExporter {
    container: string
    id: number
    allow_edit: boolean
}

export interface PrometheusExportersIndexParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc

    'filter[PrometheusExporters.name]': string,
    'filter[PrometheusExporters.service]': string,
    'filter[PrometheusExporters.scrape_interval][]': string[],
}

export function getDefaultPrometheusExportersIndexParams(): PrometheusExportersIndexParams {
    return {
        angular: true,
        scroll: false,
        sort: '',
        page: 1,
        direction: '',
        'filter[PrometheusExporters.name]': '',
        'filter[PrometheusExporters.service]': '',
        'filter[PrometheusExporters.scrape_interval][]': [],
    };
}

// EDIT
export interface PrometheusExporterEditRoot {
    PrometheusExporter: EditablePrometheusExporter
    _csrfToken: any
}

export interface EditablePrometheusExporter extends PrometheusExporter {
    id: number
}


// POST
export interface PrometheusExporterEditPost {
    PrometheusExporter: EditablePrometheusExporter
}

// Add
export interface PrometheusExporterAddRoot {
    PrometheusExporter: PrometheusExporter
}

export interface PrometheusExporter {
    name: string
    container_id: number
    metric_path: string
    port: number
    scrape_interval: string
    scrape_timeout: string
    service: string
    yaml: string
    add_target_port: boolean
}