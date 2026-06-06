import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCreateNewTabModalComponent } from './dashboard-create-new-tab-modal.component';

describe('DashboardCreateNewTabModalComponent', () => {
    let component: DashboardCreateNewTabModalComponent;
    let fixture: ComponentFixture<DashboardCreateNewTabModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardCreateNewTabModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DashboardCreateNewTabModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
