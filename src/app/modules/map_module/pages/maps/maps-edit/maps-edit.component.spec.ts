import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsEditComponent } from './maps-edit.component';

describe('MapsEditComponent', () => {
    let component: MapsEditComponent;
    let fixture: ComponentFixture<MapsEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MapsEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MapsEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
