import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoreportWidgetComponent } from './autoreport-widget.component';

describe('AutoreportWidgetComponent', () => {
    let component: AutoreportWidgetComponent;
    let fixture: ComponentFixture<AutoreportWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AutoreportWidgetComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AutoreportWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
