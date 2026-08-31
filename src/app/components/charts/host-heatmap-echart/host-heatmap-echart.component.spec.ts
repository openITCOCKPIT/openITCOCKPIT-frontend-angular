import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HostHeatmapEchartComponent } from "./host-heatmap-echart.component";

describe("HostHeatmapEchartComponent", () => {
    let component: HostHeatmapEchartComponent;
    let fixture: ComponentFixture<HostHeatmapEchartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostHeatmapEchartComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostHeatmapEchartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
