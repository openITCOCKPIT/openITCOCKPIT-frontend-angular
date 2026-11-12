import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvesHostComponent } from './cves-host.component';

describe('CvesHostComponent', () => {
    let component: CvesHostComponent;
    let fixture: ComponentFixture<CvesHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CvesHostComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CvesHostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
