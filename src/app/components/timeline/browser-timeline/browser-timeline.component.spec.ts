import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserTimelineComponent } from './browser-timeline.component';

describe('BrowserTimelineComponent', () => {
    let component: BrowserTimelineComponent;
    let fixture: ComponentFixture<BrowserTimelineComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BrowserTimelineComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BrowserTimelineComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
