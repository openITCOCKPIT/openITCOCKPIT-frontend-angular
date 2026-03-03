import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatuspageIconSimpleComponent } from './statuspage-icon-simple.component';

describe('StatuspageIconSimpleComponent', () => {
    let component: StatuspageIconSimpleComponent;
    let fixture: ComponentFixture<StatuspageIconSimpleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatuspageIconSimpleComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StatuspageIconSimpleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
