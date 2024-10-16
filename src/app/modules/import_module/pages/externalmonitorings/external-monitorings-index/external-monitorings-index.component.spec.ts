import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalMonitoringsIndexComponent } from './external-monitorings-index.component';

describe('ExternalMonitoringsIndexComponent', () => {
    let component: ExternalMonitoringsIndexComponent;
    let fixture: ComponentFixture<ExternalMonitoringsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ExternalMonitoringsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ExternalMonitoringsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
