import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsAddComponent } from './maps-add.component';

describe('SlasAddComponent', () => {
    let component: MapsAddComponent;
    let fixture: ComponentFixture<MapsAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MapsAddComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MapsAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
