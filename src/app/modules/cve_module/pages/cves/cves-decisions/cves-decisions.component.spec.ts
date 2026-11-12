import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvesDecisionsComponent } from './cves-decisions.component';

describe('CvesDecisionsComponent', () => {
    let component: CvesDecisionsComponent;
    let fixture: ComponentFixture<CvesDecisionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CvesDecisionsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CvesDecisionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
