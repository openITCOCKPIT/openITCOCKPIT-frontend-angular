import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatuspagegroupWidgetComponent } from './statuspagegroup-widget.component';

describe('StatuspagegroupWidgetComponent', () => {
    let component: StatuspagegroupWidgetComponent;
    let fixture: ComponentFixture<StatuspagegroupWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatuspagegroupWidgetComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StatuspagegroupWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
