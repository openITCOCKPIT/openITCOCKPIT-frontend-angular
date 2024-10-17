import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalMonitoringsEditComponent } from './external-monitorings-edit.component';

describe('ExternalMonitoringsEditComponent', () => {
    let component: ExternalMonitoringsEditComponent;
    let fixture: ComponentFixture<ExternalMonitoringsEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ExternalMonitoringsEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ExternalMonitoringsEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
