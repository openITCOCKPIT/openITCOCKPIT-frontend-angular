import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HostOperationsSummaryWidgetComponent } from "./host-operations-summary-widget.component";

describe("HostOperationsSummaryWidgetComponent", () => {
    let component: HostOperationsSummaryWidgetComponent;
    let fixture: ComponentFixture<HostOperationsSummaryWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostOperationsSummaryWidgetComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostOperationsSummaryWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
