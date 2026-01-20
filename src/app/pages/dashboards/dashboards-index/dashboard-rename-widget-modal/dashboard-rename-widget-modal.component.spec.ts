import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRenameWidgetModalComponent } from './dashboard-rename-widget-modal.component';

describe('DashboardRenameWidgetModalComponent', () => {
    let component: DashboardRenameWidgetModalComponent;
    let fixture: ComponentFixture<DashboardRenameWidgetModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardRenameWidgetModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DashboardRenameWidgetModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
