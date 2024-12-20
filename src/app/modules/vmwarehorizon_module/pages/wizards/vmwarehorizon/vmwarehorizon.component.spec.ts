import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VmwarehorizonComponent } from './vmwarehorizon.component';

describe('VmwarehorizonComponent', () => {
    let component: VmwarehorizonComponent;
    let fixture: ComponentFixture<VmwarehorizonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [VmwarehorizonComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(VmwarehorizonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
