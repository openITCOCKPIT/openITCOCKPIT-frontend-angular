import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ServiceOperationsSummaryWidgetComponent } from "./service-operations-summary-widget.component";

describe("ServiceOperationsSummaryWidgetComponent", () => {
    let component: ServiceOperationsSummaryWidgetComponent;
    let fixture: ComponentFixture<ServiceOperationsSummaryWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServiceOperationsSummaryWidgetComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ServiceOperationsSummaryWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
