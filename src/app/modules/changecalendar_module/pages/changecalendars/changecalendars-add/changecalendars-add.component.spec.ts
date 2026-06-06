import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangecalendarsAddComponent } from './changecalendars-add.component';

describe('ChangecalendarsAddComponent', () => {
    let component: ChangecalendarsAddComponent;
    let fixture: ComponentFixture<ChangecalendarsAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChangecalendarsAddComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ChangecalendarsAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
