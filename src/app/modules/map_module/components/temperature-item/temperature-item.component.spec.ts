import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureItemComponent } from './temperature-item.component';

describe('TemperatureItemComponent', () => {
    let component: TemperatureItemComponent;
    let fixture: ComponentFixture<TemperatureItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TemperatureItemComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TemperatureItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
