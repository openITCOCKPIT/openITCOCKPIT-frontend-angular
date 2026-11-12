import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvesHostFindingsComponent } from './cves-host-findings.component';

describe('CvesHostFindingsComponent', () => {
    let component: CvesHostFindingsComponent;
    let fixture: ComponentFixture<CvesHostFindingsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CvesHostFindingsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CvesHostFindingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
