import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvesCvesComponent } from './cves-cves.component';

describe('CvesCvesComponent', () => {
    let component: CvesCvesComponent;
    let fixture: ComponentFixture<CvesCvesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CvesCvesComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CvesCvesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
