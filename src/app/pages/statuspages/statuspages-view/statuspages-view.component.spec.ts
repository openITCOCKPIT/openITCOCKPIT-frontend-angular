import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatuspagesViewComponent } from './statuspages-view.component';

describe('StatuspagesViewComponent', () => {
    let component: StatuspagesViewComponent;
    let fixture: ComponentFixture<StatuspagesViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatuspagesViewComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StatuspagesViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
