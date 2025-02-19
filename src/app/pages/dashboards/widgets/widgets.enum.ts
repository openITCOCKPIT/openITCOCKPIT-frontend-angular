export enum WidgetTypes {

    // Core Widgets defined in WidgetsTable.php
    WelcomeWidget = 1,
    ParentOutagesWidget = 2,
    HostsPiechartWidget = 3,
    HostsPiechart180Widget = 7,
    ServicesPiechartWidget = 4,
    ServicesPiechart180Widget = 8,
    NoticeWidget = 13,
    TodayWidget = 23,
    CalendarWidget = 24,
    HostsDowntimeWidget = 5,
    ServicesDowntimeWidget = 6,
    HostsTopAlertsWidget = 35,
    ServicesTopAlertsWidget = 36,
    HostsStatusWidget = 9,                        // hosts-status-list-widget
    HostStatusOverviewWidget = 16,
    HostsStatusExtendedWidget = 25,               // hosts-status-list-extended-widget
    TacticalOverviewHostsWidget = 21,
    HostStatusOverviewExtendedWidget = 14,
    ServicesStatusWidget = 10,                    // services-status-list-widget
    TachometerWidget = 12,
    TrafficlightWidget = 11,
    ServiceStatusOverviewWidget = 17,
    ServicesStatusExtendedWidget = 26,
    TacticalOverviewServicesWidget = 22,
    ServiceStatusOverviewExtendedWidget = 20,
    AutomapWidget = 19,
    WebsiteWidget = 18,

    // MapModule Widgets.php (Core Module)
    MapWidget = 100,

    // GrafanaModule Widgets.php (Core Module)
    GrafanaWidget = 200,
    GrafanaWidgetUserdefined = 201,

    // ChangecalendarModule Widgets.php (Core Module)
    ChangecalendarWidget = 90700,


    // EventcorrelationModule Widgets.php (EE Module)
    EvcWidget = 300,

    // AutoreportModule Widgets.php (EE Module)
    AutoreportWidget = 400,

    // SLAModule Widgets.php (EE Module)
    SlaWidget = 500,
    SlaCalendarWidget = 501,
    SlaSummaryWidget = 502,

    // CustomalertModule Widgets.php (EE Module)
    CustomalertsWidget = 600,

    // ScmModule Widgets.php (EE Module)
    MyResourcesSummaryWidget = 800,
}
