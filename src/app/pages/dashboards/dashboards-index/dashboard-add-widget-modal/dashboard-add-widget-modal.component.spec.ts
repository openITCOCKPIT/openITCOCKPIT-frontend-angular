import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAddWidgetModalComponent } from './dashboard-add-widget-modal.component';

describe('DashboardAddWidgetModalComponent', () => {
    let component: DashboardAddWidgetModalComponent;
    let fixture: ComponentFixture<DashboardAddWidgetModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardAddWidgetModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DashboardAddWidgetModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
