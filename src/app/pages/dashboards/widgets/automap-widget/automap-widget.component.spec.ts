import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomapWidgetComponent } from './automap-widget.component';

describe('AutomapWidgetComponent', () => {
    let component: AutomapWidgetComponent;
    let fixture: ComponentFixture<AutomapWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AutomapWidgetComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AutomapWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
