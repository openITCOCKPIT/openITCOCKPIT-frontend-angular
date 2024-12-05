import { EvcTree } from '../../eventcorrelations.interface';
import { EventcorrelationOperators } from '../../eventcorrelations.enum';

/**
 * Returns an EvcTree with has two open ends
 * (no final vService)
 */
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

/**
 * EVC where the last two operators overlap and have a collision
 */
export function getTestTreeForCollisionDevelopment(): EvcTree[] {
    return [
        {
            "ui-id-986a50d9-9c41-4b8e-a6f9-7b52e56a48c1": [
                {
                    "id": "ui-id-986a50d9-9c41-4b8e-a6f9-7b52e56a48c1_1",
                    "parent_id": "ui-id-986a50d9-9c41-4b8e-a6f9-7b52e56a48c1",
                    "host_id": 593,
                    "service_id": 508,
                    "operator": null,
                    "service": {
                        "id": 508,
                        "servicetemplate_id": 1,
                        "host_id": 245,
                        "name": null,
                        "description": null,
                        "service_type": 1,
                        "uuid": "bfee80d1-c373-4511-b3ca-9e64b6b79545",
                        "disabled": 0,
                        "host": {
                            "id": 245,
                            "name": "brower push notification"
                        },
                        "servicename": "Ping",
                        "servicestatus": {}
                    }
                },
                {
                    "id": "ui-id-986a50d9-9c41-4b8e-a6f9-7b52e56a48c1_2",
                    "parent_id": "ui-id-986a50d9-9c41-4b8e-a6f9-7b52e56a48c1",
                    "host_id": 593,
                    "service_id": 498,
                    "operator": null,
                    "service": {
                        "id": 498,
                        "servicetemplate_id": 1,
                        "host_id": 243,
                        "name": null,
                        "description": null,
                        "service_type": 1,
                        "uuid": "a4741849-7d94-47a0-aab3-cf22f514b120",
                        "disabled": 0,
                        "host": {
                            "id": 243,
                            "name": "Agent Auf SAT IPv6"
                        },
                        "servicename": "Ping",
                        "servicestatus": {}
                    }
                }
            ],
            "ui-id-bbd7f256-9340-4433-9348-7e6b89eb0df5": [
                {
                    "id": "ui-id-bbd7f256-9340-4433-9348-7e6b89eb0df5_1",
                    "parent_id": "ui-id-bbd7f256-9340-4433-9348-7e6b89eb0df5",
                    "host_id": 593,
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
                        "host": {
                            "id": 8,
                            "name": "Classified Interfaces 1"
                        },
                        "servicename": "Print Name",
                        "servicestatus": {}
                    }
                },
                {
                    "id": "ui-id-bbd7f256-9340-4433-9348-7e6b89eb0df5_2",
                    "parent_id": "ui-id-bbd7f256-9340-4433-9348-7e6b89eb0df5",
                    "host_id": 593,
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
                        "host": {
                            "id": 8,
                            "name": "Classified Interfaces 1"
                        },
                        "servicename": "check_classified_interfaces.php",
                        "servicestatus": {}
                    }
                }
            ],
            "ui-id-4177b1ef-5e8b-4e3b-86ac-ba15c93ec993": [
                {
                    "id": "ui-id-4177b1ef-5e8b-4e3b-86ac-ba15c93ec993_1",
                    "parent_id": "ui-id-4177b1ef-5e8b-4e3b-86ac-ba15c93ec993",
                    "host_id": 593,
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
                        "host": {
                            "id": 8,
                            "name": "Classified Interfaces 1"
                        },
                        "servicename": "check_classified_interfaces.php",
                        "servicestatus": {}
                    }
                },
                {
                    "id": "ui-id-4177b1ef-5e8b-4e3b-86ac-ba15c93ec993_2",
                    "parent_id": "ui-id-4177b1ef-5e8b-4e3b-86ac-ba15c93ec993",
                    "host_id": 593,
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
                        "host": {
                            "id": 8,
                            "name": "Classified Interfaces 1"
                        },
                        "servicename": "Print Name",
                        "servicestatus": {}
                    }
                }
            ],
            "ui-id-7284959b-8c71-4119-8501-b7cc9c9a87eb": [
                {
                    "id": "ui-id-7284959b-8c71-4119-8501-b7cc9c9a87eb_1",
                    "parent_id": "ui-id-7284959b-8c71-4119-8501-b7cc9c9a87eb",
                    "host_id": 593,
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
                        "host": {
                            "id": 8,
                            "name": "Classified Interfaces 1"
                        },
                        "servicename": "Print Name",
                        "servicestatus": {}
                    }
                },
                {
                    "id": "ui-id-7284959b-8c71-4119-8501-b7cc9c9a87eb_2",
                    "parent_id": "ui-id-7284959b-8c71-4119-8501-b7cc9c9a87eb",
                    "host_id": 593,
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
                        "host": {
                            "id": 8,
                            "name": "Classified Interfaces 1"
                        },
                        "servicename": "check_classified_interfaces.php",
                        "servicestatus": {}
                    }
                }
            ]
        },
        {
            "ui-id-cff47208-cbff-41a9-b053-178e5e530323": [
                {
                    "id": "ui-id-986a50d9-9c41-4b8e-a6f9-7b52e56a48c1",
                    "parent_id": "ui-id-cff47208-cbff-41a9-b053-178e5e530323",
                    "host_id": 593,
                    "service_id": "ui-id-986a50d9-9c41-4b8e-a6f9-7b52e56a48c1_vService",
                    "operator": EventcorrelationOperators.AND,
                    "usedBy": [],
                    "service": {
                        "id": "ui-id-986a50d9-9c41-4b8e-a6f9-7b52e56a48c1_vService",
                        "servicetemplate_id": 174,
                        "host_id": 593,
                        "name": "11",
                        "description": null,
                        "service_type": 2,
                        "uuid": null,
                        "disabled": 0,
                        "host": {
                            "id": 593,
                            "name": "sadsadsadsad"
                        },
                        "servicename": "11",
                        "servicestatus": {}
                    }
                },
                {
                    "id": "ui-id-7284959b-8c71-4119-8501-b7cc9c9a87eb",
                    "parent_id": "ui-id-cff47208-cbff-41a9-b053-178e5e530323",
                    "host_id": 593,
                    "service_id": "ui-id-7284959b-8c71-4119-8501-b7cc9c9a87eb_vService",
                    "operator": EventcorrelationOperators.OR,
                    "usedBy": [],
                    "service": {
                        "id": "ui-id-7284959b-8c71-4119-8501-b7cc9c9a87eb_vService",
                        "servicetemplate_id": 174,
                        "host_id": 593,
                        "name": "44",
                        "description": null,
                        "service_type": 2,
                        "uuid": null,
                        "disabled": 0,
                        "host": {
                            "id": 593,
                            "name": "sadsadsadsad"
                        },
                        "servicename": "44",
                        "servicestatus": {}
                    }
                }
            ],
            "ui-id-32b93b8f-49c1-4e47-af03-f0c919f0ac35": [
                {
                    "id": "ui-id-bbd7f256-9340-4433-9348-7e6b89eb0df5",
                    "parent_id": "ui-id-32b93b8f-49c1-4e47-af03-f0c919f0ac35",
                    "host_id": 593,
                    "service_id": "ui-id-bbd7f256-9340-4433-9348-7e6b89eb0df5_vService",
                    "operator": EventcorrelationOperators.OR,
                    "usedBy": [],
                    "service": {
                        "id": "ui-id-bbd7f256-9340-4433-9348-7e6b89eb0df5_vService",
                        "servicetemplate_id": 174,
                        "host_id": 593,
                        "name": "22",
                        "description": null,
                        "service_type": 2,
                        "uuid": null,
                        "disabled": 0,
                        "host": {
                            "id": 593,
                            "name": "sadsadsadsad"
                        },
                        "servicename": "22",
                        "servicestatus": {}
                    }
                },
                {
                    "id": "ui-id-4177b1ef-5e8b-4e3b-86ac-ba15c93ec993",
                    "parent_id": "ui-id-32b93b8f-49c1-4e47-af03-f0c919f0ac35",
                    "host_id": 593,
                    "service_id": "ui-id-4177b1ef-5e8b-4e3b-86ac-ba15c93ec993_vService",
                    "operator": EventcorrelationOperators.MIN,
                    "usedBy": [],
                    "service": {
                        "id": "ui-id-4177b1ef-5e8b-4e3b-86ac-ba15c93ec993_vService",
                        "servicetemplate_id": 174,
                        "host_id": 593,
                        "name": "33",
                        "description": null,
                        "service_type": 2,
                        "uuid": null,
                        "disabled": 0,
                        "host": {
                            "id": 593,
                            "name": "sadsadsadsad"
                        },
                        "servicename": "33",
                        "servicestatus": {}
                    }
                }
            ]
        },
        {
            "ui-id-cff47208-cbff-41a9-b053-178e5e530323_vService": [
                {
                    "id": "ui-id-cff47208-cbff-41a9-b053-178e5e530323",
                    "parent_id": null,
                    "host_id": 593,
                    "service_id": "ui-id-cff47208-cbff-41a9-b053-178e5e530323_vService",
                    "operator": EventcorrelationOperators.AND,
                    "usedBy": [],
                    "service": {
                        "id": "ui-id-cff47208-cbff-41a9-b053-178e5e530323_vService",
                        "servicetemplate_id": 174,
                        "host_id": 593,
                        "name": "1144",
                        "description": null,
                        "service_type": 2,
                        "uuid": null,
                        "disabled": 0,
                        "host": {
                            "id": 593,
                            "name": "sadsadsadsad"
                        },
                        "servicename": "1144",
                        "servicestatus": {}
                    }
                }
            ],
            "ui-id-32b93b8f-49c1-4e47-af03-f0c919f0ac35_vService": [
                {
                    "id": "ui-id-32b93b8f-49c1-4e47-af03-f0c919f0ac35",
                    "parent_id": null,
                    "host_id": 593,
                    "service_id": "ui-id-32b93b8f-49c1-4e47-af03-f0c919f0ac35_vService",
                    "operator": EventcorrelationOperators.MIN,
                    "usedBy": [],
                    "service": {
                        "id": "ui-id-32b93b8f-49c1-4e47-af03-f0c919f0ac35_vService",
                        "servicetemplate_id": 174,
                        "host_id": 593,
                        "name": "2233",
                        "description": null,
                        "service_type": 2,
                        "uuid": null,
                        "disabled": 0,
                        "host": {
                            "id": 593,
                            "name": "sadsadsadsad"
                        },
                        "servicename": "2233",
                        "servicestatus": {}
                    }
                }
            ]
        }
    ];
}
