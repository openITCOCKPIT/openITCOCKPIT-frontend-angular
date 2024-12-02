import { EvcTree } from '../../eventcorrelations.interface';
import { EventcorrelationOperators } from '../../eventcorrelations.enum';

export function getTestTreeForDevelopment(): EvcTree[] {

    let evcTree: EvcTree[] = [
        {
            "94": [{
                "id": 95, "parent_id": 94, "host_id": 589, "service_id": 2108, "operator": null,
                "service": {
                    "id": 2108,
                    "servicetemplate_id": 174,
                    "host_id": 586,
                    "name": "1",
                    "description": null,
                    "service_type": 2,
                    "uuid": "0f1e9159-5458-4685-9e94-22a59a97bae9",
                    "disabled": 0,
                    "host": {"id": 586, "name": "Neue EVK neue GUI"},
                    "servicetemplate": {
                        "id": 174,
                        "name": "evc-default-service",
                        "description": "Virtual service to store the result of an event correlation."
                    },
                    "servicename": "1",
                    "servicestatus": {}
                }, "usedBy": []
            }, {
                "id": 96, "parent_id": 94, "host_id": 589, "service_id": 1971, "operator": null, "service": {
                    "id": 1971,
                    "servicetemplate_id": 8,
                    "host_id": 556,
                    "name": null,
                    "description": null,
                    "service_type": 1,
                    "uuid": "563bb8e8-7abd-44fb-b875-7ec70cf41c73",
                    "disabled": 0,
                    "host": {"id": 556, "name": "default host copy neue gui edit eid"},
                    "servicetemplate": {
                        "id": 8,
                        "name": "Disk usage /",
                        "description": "Checks a local disk of the openITCOCKPIT Server"
                    },
                    "servicename": "Disk usage /",
                    "servicestatus": {}
                }, "usedBy": []
            }], "ui-id-780d1d4d-e90d-4cf4-aa09-e344bdaa04d5": [{
                "id": "ui-id-780d1d4d-e90d-4cf4-aa09-e344bdaa04d5_1",
                "parent_id": "ui-id-780d1d4d-e90d-4cf4-aa09-e344bdaa04d5",
                "host_id": 589,
                "service_id": 42,
                "operator": null,
                "service": {
                    "id": 42,
                    "servicetemplate_id": 397,
                    "host_id": 8,
                    "name": null,
                    "description": null,
                    "service_type": 1,
                    "uuid": "9a29188b-340c-49e6-acd0-6749d123a4e6",
                    "disabled": 0,
                    "host": {"id": 8, "name": "Classified Interfaces 1"},
                    "servicename": "Print Name",
                    "servicestatus": {}
                }
            }, {
                "id": "ui-id-780d1d4d-e90d-4cf4-aa09-e344bdaa04d5_2",
                "parent_id": "ui-id-780d1d4d-e90d-4cf4-aa09-e344bdaa04d5",
                "host_id": 589,
                "service_id": 40,
                "operator": null,
                "service": {
                    "id": 40,
                    "servicetemplate_id": 396,
                    "host_id": 8,
                    "name": null,
                    "description": null,
                    "service_type": 1,
                    "uuid": "db4118e1-f545-4667-b147-405fd6cb0f22",
                    "disabled": 0,
                    "host": {"id": 8, "name": "Classified Interfaces 1"},
                    "servicename": "check_classified_interfaces.php",
                    "servicestatus": {}
                }
            }]
        }, {
            "ui-id-780d1d4d-e90d-4cf4-aa09-e344bdaa04d5_vService": [{
                "id": "ui-id-780d1d4d-e90d-4cf4-aa09-e344bdaa04d5",
                "parent_id": null,
                "host_id": 589,
                "service_id": "ui-id-780d1d4d-e90d-4cf4-aa09-e344bdaa04d5_vService",
                "operator": EventcorrelationOperators.AND,
                "usedBy": [],
                "service": {
                    "id": "ui-id-780d1d4d-e90d-4cf4-aa09-e344bdaa04d5_vService",
                    "servicetemplate_id": 174,
                    "host_id": 589,
                    "name": "2 rein",
                    "description": null,
                    "service_type": 2,
                    "uuid": null,
                    "disabled": 0,
                    "host": {"id": 589, "name": "EVK in EVK"},
                    "servicename": "2 rein",
                    "servicestatus": {}
                }
            }], "ui-id-2d240751-8ddb-4dc5-b3e7-d404e2357171": [{
                "id": 94,
                "parent_id": "ui-id-2d240751-8ddb-4dc5-b3e7-d404e2357171",
                "host_id": 589,
                "service_id": 2110,
                "operator": EventcorrelationOperators.AND,
                "service": {
                    "id": 2110,
                    "servicetemplate_id": 174,
                    "host_id": 589,
                    "name": "2",
                    "description": null,
                    "service_type": 2,
                    "uuid": "139ca15e-901f-4436-9a97-c96ba6fc7715",
                    "disabled": 0,
                    "host": {"id": 589, "name": "EVK in EVK"},
                    "servicetemplate": {
                        "id": 174,
                        "name": "evc-default-service",
                        "description": "Virtual service to store the result of an event correlation."
                    },
                    "servicename": "2",
                    "servicestatus": {}
                },
                "usedBy": []
            }]
        }, {
            "ui-id-2d240751-8ddb-4dc5-b3e7-d404e2357171_vService": [{
                "id": "ui-id-2d240751-8ddb-4dc5-b3e7-d404e2357171",
                "parent_id": null,
                "host_id": 589,
                "service_id": "ui-id-2d240751-8ddb-4dc5-b3e7-d404e2357171_vService",
                "operator": EventcorrelationOperators.EQ,
                "usedBy": [],
                "service": {
                    "id": "ui-id-2d240751-8ddb-4dc5-b3e7-d404e2357171_vService",
                    "servicetemplate_id": 174,
                    "host_id": 589,
                    "name": "ein EQ an bestehenden",
                    "description": null,
                    "service_type": 2,
                    "uuid": null,
                    "disabled": 0,
                    "host": {"id": 589, "name": "EVK in EVK"},
                    "servicename": "ein EQ an bestehenden",
                    "servicestatus": {}
                }
            }]
        }];

    return evcTree;

}
