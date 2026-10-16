import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HostDowntimeComponentComponent } from "./host-downtime-component.component";

describe("HostDowntimeComponentComponent", () => {
    let component: HostDowntimeComponentComponent;
    let fixture: ComponentFixture<HostDowntimeComponentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostDowntimeComponentComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostDowntimeComponentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
