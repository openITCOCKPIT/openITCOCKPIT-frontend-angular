import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvesPagesNavComponent } from './cves-pages-nav.component';

describe('CvesPagesNavComponent', () => {
    let component: CvesPagesNavComponent;
    let fixture: ComponentFixture<CvesPagesNavComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CvesPagesNavComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CvesPagesNavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
