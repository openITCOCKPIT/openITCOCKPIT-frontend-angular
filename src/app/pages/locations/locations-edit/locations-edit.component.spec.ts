import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationsEditComponent } from './locations-edit.component';

describe('LocationsEditComponent', () => {
    let component: LocationsEditComponent;
    let fixture: ComponentFixture<LocationsEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LocationsEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LocationsEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
