import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorScoreTooltipComponent } from './operator-score-tooltip.component';

describe('OperatorScoreTooltipComponent', () => {
    let component: OperatorScoreTooltipComponent;
    let fixture: ComponentFixture<OperatorScoreTooltipComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OperatorScoreTooltipComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(OperatorScoreTooltipComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
