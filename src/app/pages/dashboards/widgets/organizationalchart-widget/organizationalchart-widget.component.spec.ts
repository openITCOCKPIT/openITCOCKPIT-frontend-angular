import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationalchartWidgetComponent } from './organizationalchart-widget.component';

describe('OrganizationalchartWidgetComponent', () => {
    let component: OrganizationalchartWidgetComponent;
    let fixture: ComponentFixture<OrganizationalchartWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OrganizationalchartWidgetComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(OrganizationalchartWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
