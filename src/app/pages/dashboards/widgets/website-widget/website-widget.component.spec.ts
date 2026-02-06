import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteWidgetComponent } from './website-widget.component';

describe('WebsiteWidgetComponent', () => {
    let component: WebsiteWidgetComponent;
    let fixture: ComponentFixture<WebsiteWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WebsiteWidgetComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(WebsiteWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
