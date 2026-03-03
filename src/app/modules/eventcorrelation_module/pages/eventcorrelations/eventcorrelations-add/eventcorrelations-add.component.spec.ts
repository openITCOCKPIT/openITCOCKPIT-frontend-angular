import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventcorrelationsAddComponent } from './eventcorrelations-add.component';

describe('EventcorrelationsAddComponent', () => {
    let component: EventcorrelationsAddComponent;
    let fixture: ComponentFixture<EventcorrelationsAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EventcorrelationsAddComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EventcorrelationsAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
