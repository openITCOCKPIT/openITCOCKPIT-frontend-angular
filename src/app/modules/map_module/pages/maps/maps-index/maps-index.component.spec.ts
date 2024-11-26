import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsIndexComponent } from './maps-index.component';

describe('MapsIndexComponent', () => {
    let component: MapsIndexComponent;
    let fixture: ComponentFixture<MapsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MapsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MapsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
