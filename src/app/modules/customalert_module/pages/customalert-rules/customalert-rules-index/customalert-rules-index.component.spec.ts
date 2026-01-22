import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomalertRulesIndexComponent } from './customalert-rules-index.component';

describe('CustomalertRulesIndexComponent', () => {
    let component: CustomalertRulesIndexComponent;
    let fixture: ComponentFixture<CustomalertRulesIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomalertRulesIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CustomalertRulesIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
