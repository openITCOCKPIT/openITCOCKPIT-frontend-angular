import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvesRecommendationsComponent } from './cves-recommendations.component';

describe('CvesRecommendationsComponent', () => {
    let component: CvesRecommendationsComponent;
    let fixture: ComponentFixture<CvesRecommendationsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CvesRecommendationsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CvesRecommendationsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
