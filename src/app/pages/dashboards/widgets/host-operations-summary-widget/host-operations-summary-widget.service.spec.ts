import { TestBed } from "@angular/core/testing";

import { HostOperationsSummaryWidgetService } from "./host-operations-summary-widget.service";

describe("HostOperationsSummaryWidgetService", () => {
    let service: HostOperationsSummaryWidgetService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(HostOperationsSummaryWidgetService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
