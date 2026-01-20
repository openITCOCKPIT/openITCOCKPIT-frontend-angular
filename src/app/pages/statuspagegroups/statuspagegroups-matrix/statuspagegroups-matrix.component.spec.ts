import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatuspagegroupsMatrixComponent } from './statuspagegroups-matrix.component';

describe('StatuspagegroupsMatrixComponent', () => {
    let component: StatuspagegroupsMatrixComponent;
    let fixture: ComponentFixture<StatuspagegroupsMatrixComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatuspagegroupsMatrixComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StatuspagegroupsMatrixComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
