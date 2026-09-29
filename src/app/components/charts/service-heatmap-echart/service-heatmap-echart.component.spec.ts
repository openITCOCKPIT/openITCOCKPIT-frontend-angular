import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ServiceHeatmapEchartComponent } from "./service-heatmap-echart.component";

describe("ServiceHeatmapEchartComponent", () => {
    let component: ServiceHeatmapEchartComponent;
    let fixture: ComponentFixture<ServiceHeatmapEchartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServiceHeatmapEchartComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ServiceHeatmapEchartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});