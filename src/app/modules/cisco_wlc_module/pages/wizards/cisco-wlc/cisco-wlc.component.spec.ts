import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiscoWlcComponent } from './cisco-wlc.component';

describe('CiscoWlcComponent', () => {
    let component: CiscoWlcComponent;
    let fixture: ComponentFixture<CiscoWlcComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CiscoWlcComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CiscoWlcComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
