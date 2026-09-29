import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HostStatusScatterEchartComponent } from "./host-status-scatter-echart.component";

describe("HostStatusScatterEchartComponent", () => {
    let component: HostStatusScatterEchartComponent;
    let fixture: ComponentFixture<HostStatusScatterEchartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostStatusScatterEchartComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostStatusScatterEchartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
