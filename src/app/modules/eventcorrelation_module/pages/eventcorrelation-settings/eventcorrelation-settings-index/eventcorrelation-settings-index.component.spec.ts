import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventcorrelationSettingsIndexComponent } from './eventcorrelation-settings-index.component';

describe('EventcorrelationSettingsIndexComponent', () => {
    let component: EventcorrelationSettingsIndexComponent;
    let fixture: ComponentFixture<EventcorrelationSettingsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EventcorrelationSettingsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EventcorrelationSettingsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
