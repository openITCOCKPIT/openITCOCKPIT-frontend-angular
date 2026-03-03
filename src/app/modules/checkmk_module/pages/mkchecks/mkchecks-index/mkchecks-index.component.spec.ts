import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MkchecksIndexComponent } from './mkchecks-index.component';

describe('MkchecksIndexComponent', () => {
    let component: MkchecksIndexComponent;
    let fixture: ComponentFixture<MkchecksIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MkchecksIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MkchecksIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
