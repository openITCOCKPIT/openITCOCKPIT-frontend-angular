import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatuspagegroupsViewerComponent } from './statuspagegroups-viewer.component';

describe('StatuspagegroupsViewerComponent', () => {
    let component: StatuspagegroupsViewerComponent;
    let fixture: ComponentFixture<StatuspagegroupsViewerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatuspagegroupsViewerComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StatuspagegroupsViewerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
