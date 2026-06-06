import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangecalendarsEditComponent } from './changecalendars-edit.component';

describe('ChangecalendarsEditComponent', () => {
    let component: ChangecalendarsEditComponent;
    let fixture: ComponentFixture<ChangecalendarsEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChangecalendarsEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ChangecalendarsEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
