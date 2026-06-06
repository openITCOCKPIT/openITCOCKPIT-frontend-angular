import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventcorrelationsIndexComponent } from './eventcorrelations-index.component';

describe('EventcorrelationsIndexComponent', () => {
    let component: EventcorrelationsIndexComponent;
    let fixture: ComponentFixture<EventcorrelationsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EventcorrelationsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EventcorrelationsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
