import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoreportIndexComponent } from './autoreport-index.component';

describe('AutoreportIndexComponent', () => {
    let component: AutoreportIndexComponent;
    let fixture: ComponentFixture<AutoreportIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AutoreportIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AutoreportIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
