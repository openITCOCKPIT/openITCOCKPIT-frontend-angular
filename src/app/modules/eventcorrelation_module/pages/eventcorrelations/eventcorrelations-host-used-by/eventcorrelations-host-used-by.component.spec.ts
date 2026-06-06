import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventcorrelationsHostUsedByComponent } from './eventcorrelations-host-used-by.component';

describe('EventcorrelationsHostUsedByComponent', () => {
    let component: EventcorrelationsHostUsedByComponent;
    let fixture: ComponentFixture<EventcorrelationsHostUsedByComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EventcorrelationsHostUsedByComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EventcorrelationsHostUsedByComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
