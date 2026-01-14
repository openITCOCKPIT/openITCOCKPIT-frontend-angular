import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatuspagegroupsViewComponent } from './statuspagegroups-view.component';

describe('StatuspagegroupsViewComponent', () => {
    let component: StatuspagegroupsViewComponent;
    let fixture: ComponentFixture<StatuspagegroupsViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatuspagegroupsViewComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StatuspagegroupsViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
