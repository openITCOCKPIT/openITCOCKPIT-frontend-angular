import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegexHelperTooltipComponent } from './regex-helper-tooltip.component';

describe('RegexHelperTooltipComponent', () => {
    let component: RegexHelperTooltipComponent;
    let fixture: ComponentFixture<RegexHelperTooltipComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RegexHelperTooltipComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RegexHelperTooltipComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
