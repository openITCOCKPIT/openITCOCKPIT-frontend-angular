import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAllocationsEditComponent } from './dashboard-allocations-edit.component';

describe('DashboardAllocationsEditComponent', () => {
    let component: DashboardAllocationsEditComponent;
    let fixture: ComponentFixture<DashboardAllocationsEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardAllocationsEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DashboardAllocationsEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
