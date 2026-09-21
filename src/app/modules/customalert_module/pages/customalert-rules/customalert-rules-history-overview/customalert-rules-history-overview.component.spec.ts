import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomalertRulesHistoryOverviewComponent } from './customalert-rules-history-overview.component';

describe('CustomalertRulesHistoryComponent', () => {
    let component: CustomalertRulesHistoryOverviewComponent;
    let fixture: ComponentFixture<CustomalertRulesHistoryOverviewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomalertRulesHistoryOverviewComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CustomalertRulesHistoryOverviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
