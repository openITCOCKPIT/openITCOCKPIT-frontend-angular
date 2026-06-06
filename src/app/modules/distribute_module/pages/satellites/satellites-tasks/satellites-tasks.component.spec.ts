import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SatellitesTasksComponent } from './satellites-tasks.component';

describe('SatellitesTasksComponent', () => {
    let component: SatellitesTasksComponent;
    let fixture: ComponentFixture<SatellitesTasksComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SatellitesTasksComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SatellitesTasksComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
