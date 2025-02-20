export interface DowntimeReportsRequest {
    evaluation_type: number
    reflection_state: number
    report_format: number
    timeperiod_id: number
    from_date: string
    to_date: string
}

export function getDefaultDowntimeReportsRequest(): DowntimeReportsRequest {
    let toDate: Date = new Date(),
        fromDate: Date = new Date();
    // Manipulate from date.
    fromDate.setDate(fromDate.getDate() - 30);

    // Format dates.
    let fromDateString: string = `${fromDate.getFullYear()}-${(fromDate.getMonth() + 1).toString().padStart(2, '0')}-${fromDate.getDate().toString().padStart(2, '0')}`,
        toDateString: string = `${toDate.getFullYear()}-${(toDate.getMonth() + 1).toString().padStart(2, '0')}-${toDate.getDate().toString().padStart(2, '0')}`;

    return {
        evaluation_type: 0,
        reflection_state: 1,
        report_format: 2,
        timeperiod_id: 0,
        from_date: fromDateString,
        to_date: toDateString,
    } as DowntimeReportsRequest;
}

// RESPONSE
export interface DowntimeReportsResponse {
    downtimeReport: DowntimeReport
    _csrfToken: string
}

export interface DowntimeReport {
    hostsWithoutOutages: {
        hosts: OutageHost[]
    },
    hostsWithOutages: HostsWithOutage[]
    totalTime: number
    downtimes: Downtimes
}

export interface OutageHost {
    Host: Host
    pieChartData: PieChartData
    Services?: ServicesList
}

export interface ServicesList {
    [key: string]: ServiceObject
}

export interface ServiceObject {
    Service: {
        id: number
        uuid: string
        name: string | null
        servicetemplate_id: number
        reportData: number[]
    }
    Host: {
        id: number
        uuid: string
        name: string
    }
    Servicetemplate: {
        id: number
        name: string
        template_name: string
    }
    pieChartData: {
        labels: string[]
        data: string[]
        availability: number
        widgetOverview: {
            percent: number
            human: string
        }[]
    }
}

export interface HostsWithOutage {
    hosts: OutageHost[]
    hostBarChartData: HostBarChartData
}

export interface HostBarChartData {
    labels: string[]
    datasets: Datasets
}

export interface Datasets {
    "0": {
        label: string
        type: string
        data: [
            string,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number
        ]
    }
    "1": {
        label: string
        type: string
        data: [
            string,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number
        ]
    }
    "2": {
        label: string
        type: string
        data: [
            string,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number
        ]
    }
    availability: Availability
}

export interface Availability {
    label: string
    type: string
    data: string[]
}




export interface Host {
    id: number
    name: string
    description: any
    address: string
    reportData: number[]
}

export interface PieChartData {
    labels: string[]
    data: string[]
    availability: number
    widgetOverview: WidgetOverview[]
}

export interface WidgetOverview {
    percent: number
    human: string
}

export interface Downtimes {
    Hosts: {
        author_name: string
        comment_data: string
        entry_time: string
        scheduled_start_time: string
        scheduled_end_time: string
        duration: number
        was_started: number
        internal_downtime_id: number
        was_cancelled: number
        Hosts: {
            id: number
            uuid: string
            name: string
        }
        HostsToContainers: {
            container_id: number
        }
    }[]
    Services: {
        author_name: string
        comment_data: string
        entry_time: string
        scheduled_start_time: string
        scheduled_end_time: string
        duration: number
        was_started: number
        internal_downtime_id: number
        was_cancelled: number
        Services: {
            id: number
            uuid: string
            name: string
            servicetemplate_id: number
        }
        Servicetemplates: {
            id: number
            name: string
            template_name: number
        }
        Hosts: {
            id: number
            uuid: string
            name: string
        }
        HostsToContainers: {
            container_id: number
        }
    }[] | undefined
}



