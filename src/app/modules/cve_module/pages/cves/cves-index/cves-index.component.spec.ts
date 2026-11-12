import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvesIndexComponent } from './cves-index.component';

describe('CvesIndexComponent', () => {
    let component: CvesIndexComponent;
    let fixture: ComponentFixture<CvesIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CvesIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CvesIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
