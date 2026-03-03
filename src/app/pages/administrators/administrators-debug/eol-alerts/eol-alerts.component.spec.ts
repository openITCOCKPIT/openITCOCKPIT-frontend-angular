import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EolAlertsComponent } from './eol-alerts.component';

describe('EolAlertsComponent', () => {
    let component: EolAlertsComponent;
    let fixture: ComponentFixture<EolAlertsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EolAlertsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EolAlertsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
