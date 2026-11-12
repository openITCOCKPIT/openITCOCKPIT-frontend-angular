import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvesSoftwareComponent } from './cves-software.component';

describe('CvesSoftwareComponent', () => {
    let component: CvesSoftwareComponent;
    let fixture: ComponentFixture<CvesSoftwareComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CvesSoftwareComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CvesSoftwareComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
