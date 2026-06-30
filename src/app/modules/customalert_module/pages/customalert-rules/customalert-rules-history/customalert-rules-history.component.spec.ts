import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomalertRulesHistoryComponent } from './customalert-rules-history.component';

describe('CustomalertRulesHistoryComponent', () => {
    let component: CustomalertRulesHistoryComponent;
    let fixture: ComponentFixture<CustomalertRulesHistoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomalertRulesHistoryComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CustomalertRulesHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
