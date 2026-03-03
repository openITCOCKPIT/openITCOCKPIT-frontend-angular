import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesPiechartWidgetComponent } from './services-piechart-widget.component';

describe('ServicesPiechartWidgetComponent', () => {
    let component: ServicesPiechartWidgetComponent;
    let fixture: ComponentFixture<ServicesPiechartWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServicesPiechartWidgetComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServicesPiechartWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
