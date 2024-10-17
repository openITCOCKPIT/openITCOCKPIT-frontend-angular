import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServicedowntimeComponent } from './add-servicedowntime.component';

describe('AddServicedowntimeComponent', () => {
    let component: AddServicedowntimeComponent;
    let fixture: ComponentFixture<AddServicedowntimeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AddServicedowntimeComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AddServicedowntimeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
