import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotInMonitoringComponent } from './not-in-monitoring.component';

describe('NotInMonitoringComponent', () => {
    let component: NotInMonitoringComponent;
    let fixture: ComponentFixture<NotInMonitoringComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NotInMonitoringComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NotInMonitoringComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
