import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvesDecideModalComponent } from './cves-decide-modal.component';

describe('CvesDecideModalComponent', () => {
    let component: CvesDecideModalComponent;
    let fixture: ComponentFixture<CvesDecideModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CvesDecideModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CvesDecideModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
