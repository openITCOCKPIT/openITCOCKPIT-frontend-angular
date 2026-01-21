import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatuspagegroupsMarqueeComponent } from './statuspagegroups-marquee.component';

describe('StatuspagegroupsMarqueeComponent', () => {
    let component: StatuspagegroupsMarqueeComponent;
    let fixture: ComponentFixture<StatuspagegroupsMarqueeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatuspagegroupsMarqueeComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StatuspagegroupsMarqueeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
