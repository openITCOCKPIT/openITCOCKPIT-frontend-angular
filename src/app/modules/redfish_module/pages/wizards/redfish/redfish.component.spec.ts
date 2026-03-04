import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedfishComponent } from './redfish.component';

describe('RedfishComponent', () => {
    let component: RedfishComponent;
    let fixture: ComponentFixture<RedfishComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RedfishComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RedfishComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
