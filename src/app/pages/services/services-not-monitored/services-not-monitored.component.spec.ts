import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesNotMonitoredComponent } from './services-not-monitored.component';

describe('ServicesNotMonitoredComponent', () => {
    let component: ServicesNotMonitoredComponent;
    let fixture: ComponentFixture<ServicesNotMonitoredComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServicesNotMonitoredComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServicesNotMonitoredComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
