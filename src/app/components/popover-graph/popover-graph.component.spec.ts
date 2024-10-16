import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverGraphComponent } from './popover-graph.component';

describe('PopoverGraphComponent', () => {
    let component: PopoverGraphComponent;
    let fixture: ComponentFixture<PopoverGraphComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PopoverGraphComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PopoverGraphComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
