import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardColorpickerComponent } from './dashboard-colorpicker.component';

describe('DashboardColorpickerComponent', () => {
    let component: DashboardColorpickerComponent;
    let fixture: ComponentFixture<DashboardColorpickerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardColorpickerComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DashboardColorpickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
