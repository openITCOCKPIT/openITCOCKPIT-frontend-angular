import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangecalendarWidgetComponent } from './changecalendar-widget.component';

describe('ChangecalendarWidgetComponent', () => {
    let component: ChangecalendarWidgetComponent;
    let fixture: ComponentFixture<ChangecalendarWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChangecalendarWidgetComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ChangecalendarWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
