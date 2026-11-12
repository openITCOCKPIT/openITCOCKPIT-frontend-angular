import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvesFindingComponent } from './cves-finding.component';

describe('CvesFindingComponent', () => {
    let component: CvesFindingComponent;
    let fixture: ComponentFixture<CvesFindingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CvesFindingComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CvesFindingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
