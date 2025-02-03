import { ServiceObject } from '../../../../../pages/services/services.interface';
import { HostObject } from '../../../../../pages/hosts/hosts.interface';
import {
    GrafanaChartTypesEnum,
    GrafanaStackingModesEnum
} from './grafana-panel/chart-type-icon/GrafanaChartTypes.enum';

export interface GrafanaEditorGetResponse {
    userdashboardData: GrafanaEditorDashboard
    grafanaUnits: GrafanaUnits
    _csrfToken: string | null
}


export interface GrafanaEditorDashboard {
    id: number
    container_id: number
    configuration_id: number
    name: string
    tooltip: number
    range: string
    refresh: string
    grafana_uid: string
    grafana_url: string
    grafana_userdashboard_panels: GrafanaEditorDashboardPanel[]
    rows: GrafanaEditorDashboardRow[][] // array with arrays of rows
}

export interface GrafanaEditorDashboardPanel {
    id: number
    userdashboard_id: number
    row: number
    unit: string
    title: string
    visualization_type: GrafanaChartTypesEnum
    stacking_mode: GrafanaStackingModesEnum | null
    grafana_userdashboard_metrics: GrafanaEditorDashboardPanelMetric[]
}

export interface GrafanaEditorDashboardPanelMetric {
    id: number
    panel_id: number
    metric: string
    host_id: number
    service_id: number
    color?: string | null
    service: {
        id: number
        name?: string | null
        uuid: string
        service_type: number
        servicetemplate: {
            id: number
            name: string
        }
        prometheus_alert_rule?: GrafanaEditorPrometheusAlertRule
    }
    host: {
        id: number
        name: string
        uuid: string
    }
}

export interface GrafanaEditorDashboardRow {
    id: number
    userdashboard_id: number
    row: number
    unit: string
    title: string
    visualization_type: GrafanaChartTypesEnum
    stacking_mode: GrafanaStackingModesEnum | null
    metrics: DashboardRowMetric[]
}

export interface DashboardRowMetric {
    id: number
    panel_id: number
    metric: string
    host_id: number
    service_id: number
    color?: string | null
    service: {
        id: number
        name?: string | null
        uuid: string
        service_type: number
        servicetemplate: {
            id: number
            name: string
        }
        prometheus_alert_rule?: GrafanaEditorPrometheusAlertRule
    }
    host: {
        id: number
        name: string
        uuid: string
    }
    servicetemplate: any[]
    Servicetemplate: {
        id: number
        name: string
    }
    Host: HostObject
    Service: ServiceObject
}


export interface GrafanaEditorPrometheusAlertRule {
    id: number
    host_id: number
    service_id: number
    promql: string
    unit: string
    threshold_type: string
    warning_min: number
    warning_max: number | null
    critical_min: number
    critical_max: number | null
    warning_longer_as: string
    critical_longer_as: string
    warning_operator: string
    critical_operator: string
}

export interface CreatePanelPost {
    GrafanaUserdashboardPanel: {
        row: number
        userdashboard_id: number
        visualization_type: GrafanaChartTypesEnum
    }
}

export interface GrafanaUnits {
    None: {
        none: string
        short: string
        percent: string
        percentunit: string
        humidity: string
        dB: string
        hex0x: string
        hex: string
        sci: string
        locale: string
    }
    Time: {
        hertz: string
        ns: string
        µs: string
        ms: string
        s: string
        m: string
        h: string
        d: string
    }
    "Data (IEC)": {
        bits: string
        bytes: string
        kbytes: string
        mbytes: string
        gbytes: string
    }
    "Data (Metric)": {
        decbits: string
        decbytes: string
        deckbytes: string
        decmbytes: string
        decgbytes: string
    }
    "Data rates": {
        pps: string
        bps: string
        Bps: string
        Kbits: string
        KBs: string
        Mbits: string
        MBs: string
        Gbits: string
        GBs: string
    }
    "Data throughput": {
        ops: string
        reqps: string
        rps: string
        wps: string
        iops: string
        opm: string
        rpm: string
        wpm: string
    }
    Temperature: {
        celsius: string
        farenheit: string
        kelvin: string
    }
    Currencies: {
        currencyUSD: string
        currencyEUR: string
        currencyGBP: string
        currencyJPY: string
        currencyRUB: string
        currencyUAH: string
        currencyBRL: string
        currencyDKK: string
        currencyISK: string
        currencyNOK: string
        currencySEK: string
        currencyCZK: string
        currencyCHF: string
        currencyPLN: string
        currencyBTC: string
    }
    Length: {
        lengthmm: string
        lengthm: string
        lengthkm: string
        lengthft: string
        lengthmi: string
    }
    Area: {
        areaM2: string
        areaF2: string
        areaMI2: string
    }
    Mass: {
        massmg: string
        massg: string
        masskg: string
        masst: string
    }
    Velocity: {
        velocityms: string
        velocitykmh: string
        velocitymph: string
        velocityknot: string
    }
    Volume: {
        mlitre: string
        litre: string
        m3: string
        dm3: string
        gallons: string
    }
    Energy: {
        watt: string
        kwatt: string
        mwatt: string
        Wm2: string
        voltamp: string
        kvoltamp: string
        voltampreact: string
        kvoltampreact: string
        watth: string
        kwatth: string
        kwattm: string
        joule: string
        ev: string
        amp: string
        kamp: string
        mamp: string
        volt: string
        kvolt: string
        mvolt: string
        dBm: string
        ohm: string
        lumens: string
    }
    Pressure: {
        pressurembar: string
        pressurebar: string
        pressurekbar: string
        pressurehpa: string
        pressurekpa: string
        pressurehg: string
        pressurepsi: string
    }
    Force: {
        forceNm: string
        forcekNm: string
        forceN: string
        forcekN: string
    }
    Flow: {
        litreh: string
        flowlpm: string
        flowmlpm: string
        flowcms: string
        flowgpm: string
        flowcfs: string
        flowcfm: string
    }
    Angle: {
        degree: string
        radian: string
        grad: string
    }
    "Date and time": {
        dateTimeAsIso: string
        dateTimeAsUS: string
        dateTimeFromNow: string
    }
    "Hash rates": {
        Hs: string
        KHs: string
        MHs: string
        GHs: string
        THs: string
        PHs: string
        EHs: string
    }
    Acceleration: {
        accMS2: string
        accFS2: string
        accG: string
    }
    Radiation: {
        radbq: string
        radci: string
        radgy: string
        radrad: string
        radsv: string
        radrem: string
        radexpckg: string
        radr: string
        radsvh: string
    }
    Concentration: {
        ppm: string
        conppb: string
        conngm3: string
        conngNm3: string
        conμgm3: string
        conμgNm3: string
        conmgm3: string
        conmgNm3: string
        congm3: string
        congNm3: string
    }
}


export interface GrfanaEditorCurrentMetricPost {
    metric_id?: number
    color: string
    metric: string
    panel_id: number
    row: number
    service_id: number
    userdashboard_id: number
}
