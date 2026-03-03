import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventcorrelationsViewComponent } from './eventcorrelations-view.component';

describe('EventcorrelationsViewComponent', () => {
    let component: EventcorrelationsViewComponent;
    let fixture: ComponentFixture<EventcorrelationsViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EventcorrelationsViewComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EventcorrelationsViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
