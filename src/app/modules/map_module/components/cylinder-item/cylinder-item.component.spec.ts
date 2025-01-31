import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CylinderItemComponent } from './cylinder-item.component';

describe('TrafficlightItemComponent', () => {
    let component: CylinderItemComponent;
    let fixture: ComponentFixture<CylinderItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CylinderItemComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CylinderItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
