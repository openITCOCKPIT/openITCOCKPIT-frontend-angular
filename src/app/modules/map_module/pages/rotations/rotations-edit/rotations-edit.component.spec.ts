import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RotationsEditComponent } from './rotations-edit.component';

describe('MapsEditComponent', () => {
    let component: RotationsEditComponent;
    let fixture: ComponentFixture<RotationsEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RotationsEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RotationsEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
