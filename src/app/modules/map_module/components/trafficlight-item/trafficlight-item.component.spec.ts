import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficlightItemComponent } from './trafficlight-item.component';

describe('TrafficlightItemComponent', () => {
    let component: TrafficlightItemComponent;
    let fixture: ComponentFixture<TrafficlightItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TrafficlightItemComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TrafficlightItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
