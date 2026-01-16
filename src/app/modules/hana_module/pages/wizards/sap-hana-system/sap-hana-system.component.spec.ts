import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SapHanaSystemComponent } from './sap-hana-system.component';

describe('SapHanaSystemComponent', () => {
    let component: SapHanaSystemComponent;
    let fixture: ComponentFixture<SapHanaSystemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SapHanaSystemComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SapHanaSystemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
