import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvesViewComponent } from './cves-view.component';

describe('CvesViewComponent', () => {
    let component: CvesViewComponent;
    let fixture: ComponentFixture<CvesViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CvesViewComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CvesViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
