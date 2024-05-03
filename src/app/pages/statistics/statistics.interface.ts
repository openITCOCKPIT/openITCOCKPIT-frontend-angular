import { Systemsetting } from '../systemsettings/systemsettings.interface';

export interface StatisticsIndex {
    settings: {
        Systemsetting: Systemsetting
    }
    statistics: any,
    IS_CONTAINER: boolean
}
