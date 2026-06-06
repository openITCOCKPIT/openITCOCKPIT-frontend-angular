import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangecalendarsIndexComponent } from './changecalendars-index.component';

describe('ChangecalendarsIndexComponent', () => {
    let component: ChangecalendarsIndexComponent;
    let fixture: ComponentFixture<ChangecalendarsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChangecalendarsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ChangecalendarsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
