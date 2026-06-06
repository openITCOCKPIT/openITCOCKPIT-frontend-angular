import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoreportServiceUsedByComponent } from './autoreport-service-used-by.component';

describe('AutoreportServiceUsedByComponent', () => {
    let component: AutoreportServiceUsedByComponent;
    let fixture: ComponentFixture<AutoreportServiceUsedByComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AutoreportServiceUsedByComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AutoreportServiceUsedByComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
