import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvesHostDetailsComponent } from './cves-host-details.component';

describe('CvesHostDetailsComponent', () => {
    let component: CvesHostDetailsComponent;
    let fixture: ComponentFixture<CvesHostDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CvesHostDetailsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CvesHostDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
