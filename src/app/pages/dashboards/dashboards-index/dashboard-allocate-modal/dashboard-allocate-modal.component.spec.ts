import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAllocateModalComponent } from './dashboard-allocate-modal.component';

describe('DashboardAllocateModalComponent', () => {
    let component: DashboardAllocateModalComponent;
    let fixture: ComponentFixture<DashboardAllocateModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardAllocateModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DashboardAllocateModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
