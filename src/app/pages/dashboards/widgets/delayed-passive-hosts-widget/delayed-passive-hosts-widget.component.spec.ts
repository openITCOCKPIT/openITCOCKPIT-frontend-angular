import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelayedPassiveHostsWidgetComponent } from './delayed-passive-hosts-widget.component';

describe('DelayedPassiveHostsWidgetComponent', () => {
    let component: DelayedPassiveHostsWidgetComponent;
    let fixture: ComponentFixture<DelayedPassiveHostsWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DelayedPassiveHostsWidgetComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DelayedPassiveHostsWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
