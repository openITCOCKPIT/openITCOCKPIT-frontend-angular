import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ServiceStatusScatterEchartComponent } from "./service-status-scatter-echart.component";

describe("ServiceStatusScatterEchartComponent", () => {
    let component:ServiceStatusScatterEchartComponent;
    let fixture: ComponentFixture<ServiceStatusScatterEchartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServiceStatusScatterEchartComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ServiceStatusScatterEchartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});