import { TestBed } from "@angular/core/testing";

import { HostHeatmapEchartService } from "./host-heatmap-echart.service";

describe("HostHeatmapEchartService", () => {
    let service: HostHeatmapEchartService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(HostHeatmapEchartService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
