import { TestBed } from "@angular/core/testing";

import { ServiceOperationsSummaryWidgetService } from "./service-operations-summary-widget.service";

describe("ServiceOperationsSummaryWidgetService", () => {
    let service: ServiceOperationsSummaryWidgetService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ServiceOperationsSummaryWidgetService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
